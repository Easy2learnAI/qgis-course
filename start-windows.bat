@echo off
cd /d "%~dp0"
set PORT=8000
set PY=
where python >nul 2>nul && set PY=python
if not defined PY where py >nul 2>nul && set PY=py
if not defined PY (
  echo Python was not found. Opening the site directly from the file instead.
  start "" "%~dp0index.html"
  exit /b
)
echo Site running at http://localhost:%PORT%
echo Keep this window open. Press Ctrl+C to stop.
start "" cmd /c "timeout /t 2 >nul & start http://localhost:%PORT%"
%PY% -m http.server %PORT%
