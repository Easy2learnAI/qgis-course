// دالة إدارة المتدرّبين — تعمل في خادم Supabase بمفتاح service_role (لا يصل إلى المتصفح أبداً).
// كل طلب يُتحقَّق فيه أولاً من أن صاحبه أدمن مفعَّل.
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

// المفتاح السرّي: الاسم القديم SUPABASE_SERVICE_ROLE_KEY أو الجديد SUPABASE_SECRET_KEYS
function serviceKey(): string {
  const legacy = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (legacy) return legacy;
  const raw = Deno.env.get("SUPABASE_SECRET_KEYS") || "";
  try {
    const keys = JSON.parse(raw);
    return keys.default || Object.values(keys)[0] as string;
  } catch {
    return raw;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, serviceKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // من يطلب؟
  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const { data: who } = await admin.auth.getUser(token);
  if (!who?.user) return json({ error: "انتهت الجلسة. سجّل الدخول من جديد." }, 401);
  const { data: me } = await admin.from("profiles").select("role, active").eq("id", who.user.id).single();
  if (!me || me.role !== "admin" || !me.active) return json({ error: "هذه العملية للأدمن فقط." }, 403);

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { return json({ error: "طلب غير صالح." }, 400); }
  const id = String(body.id || "");
  const fail = (e: { message?: string } | null) => json({ error: e?.message || "خطأ غير متوقَّع." }, 400);

  switch (body.action) {
    case "list": {
      const { data, error } = await admin.auth.admin.listUsers({ page: 1, perPage: 1000 });
      if (error) return fail(error);
      const { data: profs } = await admin.from("profiles").select("id, full_name, role, active");
      const byId = new Map((profs || []).map((p) => [p.id, p]));
      const users = data.users.map((u) => {
        const p = byId.get(u.id);
        return {
          id: u.id, email: u.email, created_at: u.created_at, last_sign_in_at: u.last_sign_in_at,
          full_name: p?.full_name || "", role: p?.role || "trainee", active: p ? p.active : true,
        };
      }).sort((a, b) => (a.role === b.role ? (a.full_name || a.email || "").localeCompare(b.full_name || b.email || "", "ar") : a.role === "admin" ? -1 : 1));
      return json({ users });
    }

    case "create": {
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const full_name = String(body.full_name || "").trim();
      if (!EMAIL.test(email)) return json({ error: "البريد الإلكتروني غير صالح." }, 400);
      if (password.length < 8) return json({ error: "كلمة المرور 8 أحرف على الأقل." }, 400);
      const { data, error } = await admin.auth.admin.createUser({
        email, password, email_confirm: true, user_metadata: { full_name },
      });
      if (error) return fail(error);
      await admin.from("profiles").upsert({ id: data.user.id, email, full_name, role: "trainee", active: true });
      return json({ id: data.user.id });
    }

    case "set_active": {
      if (!id || id === who.user.id) return json({ error: "لا يمكن تنفيذ هذا على حسابك." }, 400);
      const active = !!body.active;
      const { error } = await admin.from("profiles").update({ active }).eq("id", id);
      if (error) return fail(error);
      // الإيقاف يمنع الدخول أيضاً، لا تحميل الملفات فقط
      const { error: e2 } = await admin.auth.admin.updateUserById(id, { ban_duration: active ? "none" : "87600h" });
      if (e2) return fail(e2);
      return json({ ok: true });
    }

    case "set_password": {
      const password = String(body.password || "");
      if (!id || id === who.user.id) return json({ error: "غيّر كلمة مرورك من صفحة ملفات الدورة." }, 400);
      if (password.length < 8) return json({ error: "كلمة المرور 8 أحرف على الأقل." }, 400);
      const { error } = await admin.auth.admin.updateUserById(id, { password });
      if (error) return fail(error);
      return json({ ok: true });
    }

    case "delete": {
      if (!id || id === who.user.id) return json({ error: "لا يمكن حذف حسابك." }, 400);
      const { data: target } = await admin.from("profiles").select("role").eq("id", id).single();
      if (target?.role === "admin") return json({ error: "لا يمكن حذف حساب أدمن من هنا." }, 400);
      const { error } = await admin.auth.admin.deleteUser(id);
      if (error) return fail(error);
      return json({ ok: true });
    }

    default:
      return json({ error: "عملية غير معروفة." }, 400);
  }
});
