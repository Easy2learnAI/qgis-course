@echo off
setlocal EnableExtensions
cd /d "%~dp0"
title QGIS course - local website

rem ---------- 1. pick a free port ----------
set "PORT="
for %%P in (8000 8001 8080 8765 9000) do (
  if not defined PORT (
    netstat -ano -p tcp | findstr /c:":%%P " | findstr /c:"LISTENING" >nul 2>&1
    if errorlevel 1 set "PORT=%%P"
  )
)
if not defined PORT set "PORT=8123"
set "URL=http://localhost:%PORT%/"

rem ---------- 2. find a Python that really works ----------
rem (the Microsoft Store "python" shortcut is skipped because it cannot run code)
set "PY="
call :try "%USERPROFILE%\miniconda3\python.exe"
call :try "%USERPROFILE%\anaconda3\python.exe"
call :try "%LOCALAPPDATA%\miniconda3\python.exe"
call :try "%LOCALAPPDATA%\anaconda3\python.exe"
for /d %%D in ("%LOCALAPPDATA%\Programs\Python\Python3*") do call :try "%%D\python.exe"
for /d %%D in ("%ProgramFiles%\Python3*") do call :try "%%D\python.exe"
call :try "%USERPROFILE%\.local\bin\python3.11.exe"
for /d %%D in ("%USERPROFILE%\.local\bin\python3*") do call :try "%%D"
call :try python3.12
call :try python3.11
call :try python3.10
call :try py
call :try python
call :try python3

echo.
echo   QGIS course website
echo   -------------------
echo   Address : %URL%
echo   Keep this window open while you use the site. Close it to stop.
echo.

rem open the browser 2 seconds after the server starts
start "" /b cmd /c "ping -n 3 127.0.0.1 >nul & start %URL%"

if not defined PY goto :powershell
echo   Server  : Python
echo   Using   : %PY%
echo.
"%PY%" -m http.server %PORT% --bind 127.0.0.1
goto :stopped

:powershell
echo   Server  : Windows PowerShell
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0_local\serve.ps1" -Port %PORT%

:stopped
rem ---------- 3. if no server could run, open the page directly ----------
echo.
echo   The local server stopped or could not start.
echo   Opening the site directly from the file instead...
start "" "%~dp0index.html"
pause
exit /b

:try
if defined PY exit /b
"%~1" -c "import http.server" >nul 2>&1
if not errorlevel 1 set "PY=%~1"
exit /b
