#!/usr/bin/env bash
# تشغيل الموقع محلياً على http://localhost:8000
cd "$(dirname "$0")"
PORT=8000
echo "الموقع يعمل على http://localhost:$PORT  (للإيقاف: Ctrl+C)"
( sleep 2; (command -v xdg-open >/dev/null && xdg-open "http://localhost:$PORT") || open "http://localhost:$PORT" ) >/dev/null 2>&1 &
python3 -m http.server "$PORT"
