// دالة إدارة المتدرّبين — تعمل في خادم Supabase بالمفتاح السرّي (لا يصل إلى المتصفح أبداً).
// كل طلب يُتحقَّق فيه أولاً من أن صاحبه أدمن مفعَّل، بجلسته هو (دون المفتاح السرّي).
// لا مكتبات خارجية: طلبات fetch مباشرة إلى Auth و REST.

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const URL_ = (Deno.env.get("SUPABASE_URL") || "").replace(/\/+$/, "");

// أول مفتاح من متغيّر قد يكون نصاً أو JSON مثل {"default":"sb_..."}
function pick(name: string): string {
  const raw = Deno.env.get(name) || "";
  try {
    const v = JSON.parse(raw);
    if (typeof v === "string") return v;
    return (v.default || Object.values(v)[0] || "") as string;
  } catch {
    return raw;
  }
}
// المفاتيح الجديدة أولاً؛ القديمة (JWT) احتياطاً
const SECRET = pick("SUPABASE_SECRET_KEYS") || pick("SUPABASE_SERVICE_ROLE_KEY");
const PUBLIC = pick("SUPABASE_PUBLISHABLE_KEYS") || pick("SUPABASE_ANON_KEY");

function headers(key: string, token?: string) {
  const h: Record<string, string> = { apikey: key, "Content-Type": "application/json" };
  if (token) h.Authorization = "Bearer " + token;
  else if (key.startsWith("eyJ")) h.Authorization = "Bearer " + key; // المفاتيح القديمة تحتاجه
  return h;
}

async function call(path: string, init: { method?: string; key: string; token?: string; body?: unknown; prefer?: string }) {
  const h = headers(init.key, init.token);
  if (init.prefer) h.Prefer = init.prefer;
  const r = await fetch(URL_ + path, {
    method: init.method || "GET",
    headers: h,
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
  });
  const text = await r.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }
  if (!r.ok) {
    const msg = (data && (data.msg || data.message || data.error_description || data.error)) || ("HTTP " + r.status);
    console.error("call failed", init.method || "GET", path, r.status, msg);
    throw new Error(translate(String(msg)));
  }
  return data;
}

function translate(m: string) {
  if (/already been registered|already registered|already exists/i.test(m)) return "هذا البريد مسجَّل من قبل.";
  if (/password/i.test(m) && /(weak|short|least)/i.test(m)) return "كلمة المرور ضعيفة: 8 أحرف على الأقل.";
  return m;
}

const admin = {
  list: () => call("/auth/v1/admin/users?page=1&per_page=1000", { key: SECRET }),
  create: (b: unknown) => call("/auth/v1/admin/users", { method: "POST", key: SECRET, body: b }),
  update: (id: string, b: unknown) => call("/auth/v1/admin/users/" + id, { method: "PUT", key: SECRET, body: b }),
  remove: (id: string) => call("/auth/v1/admin/users/" + id, { method: "DELETE", key: SECRET }),
  profiles: (q: string, method = "GET", body?: unknown, prefer?: string) =>
    call("/rest/v1/profiles" + q, { method, key: SECRET, body, prefer }),
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);
  if (!SECRET || !PUBLIC) return json({ error: "مفاتيح الخادم غير متوفرة في الدالة." }, 500);

  // 1) من يطلب؟ (بجلسته هو)
  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  let uid = "";
  try {
    const u = await call("/auth/v1/user", { key: PUBLIC, token });
    uid = u && u.id;
  } catch { /* handled below */ }
  if (!uid) return json({ error: "انتهت الجلسة. سجّل الدخول من جديد." }, 401);

  // 2) هل هو أدمن مفعَّل؟ (يقرأ ملفه بنفسه، تسمح به قواعد الحماية)
  try {
    const rows = await call("/rest/v1/profiles?select=role,active&id=eq." + uid, { key: PUBLIC, token });
    const me = rows && rows[0];
    if (!me || me.role !== "admin" || !me.active) return json({ error: "هذه العملية للأدمن فقط." }, 403);
  } catch (e) {
    return json({ error: "تعذّر التحقق من الصلاحيات: " + (e as Error).message }, 500);
  }

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return json({ error: "طلب غير صالح." }, 400); }
  const id = String(body.id || "");

  try {
    switch (body.action) {
      case "list": {
        const d = await admin.list();
        const profs: any[] = await admin.profiles("?select=id,full_name,role,active");
        const byId = new Map(profs.map((p) => [p.id, p]));
        const users = (d.users || []).map((u: any) => {
          const p = byId.get(u.id);
          return {
            id: u.id, email: u.email, created_at: u.created_at, last_sign_in_at: u.last_sign_in_at,
            full_name: p?.full_name || "", role: p?.role || "trainee", active: p ? p.active : true,
          };
        }).sort((a: any, b: any) => a.role === b.role
          ? (a.full_name || a.email || "").localeCompare(b.full_name || b.email || "", "ar")
          : a.role === "admin" ? -1 : 1);
        return json({ users });
      }

      case "create": {
        const email = String(body.email || "").trim().toLowerCase();
        const password = String(body.password || "");
        const full_name = String(body.full_name || "").trim();
        if (!EMAIL.test(email)) return json({ error: "البريد الإلكتروني غير صالح." }, 400);
        if (password.length < 8) return json({ error: "كلمة المرور 8 أحرف على الأقل." }, 400);
        const u = await admin.create({ email, password, email_confirm: true, user_metadata: { full_name } });
        const newId = u.id || (u.user && u.user.id);
        await admin.profiles("?on_conflict=id", "POST",
          { id: newId, email, full_name, role: "trainee", active: true }, "resolution=merge-duplicates,return=minimal");
        return json({ id: newId });
      }

      case "set_active": {
        if (!id || id === uid) return json({ error: "لا يمكن تنفيذ هذا على حسابك." }, 400);
        const active = !!body.active;
        await admin.profiles("?id=eq." + id, "PATCH", { active }, "return=minimal");
        // الإيقاف يمنع الدخول أيضاً، لا تحميل الملفات فقط
        await admin.update(id, { ban_duration: active ? "none" : "87600h" });
        return json({ ok: true });
      }

      case "set_password": {
        const password = String(body.password || "");
        if (!id || id === uid) return json({ error: "غيّر كلمة مرورك من صفحة ملفات الدورة." }, 400);
        if (password.length < 8) return json({ error: "كلمة المرور 8 أحرف على الأقل." }, 400);
        await admin.update(id, { password });
        return json({ ok: true });
      }

      case "delete": {
        if (!id || id === uid) return json({ error: "لا يمكن حذف حسابك." }, 400);
        const t: any[] = await admin.profiles("?select=role&id=eq." + id);
        if (t[0] && t[0].role === "admin") return json({ error: "لا يمكن حذف حساب أدمن من هنا." }, 400);
        await admin.remove(id);
        return json({ ok: true });
      }

      default:
        return json({ error: "عملية غير معروفة." }, 400);
    }
  } catch (e) {
    return json({ error: (e as Error).message || "خطأ غير متوقَّع." }, 400);
  }
});
