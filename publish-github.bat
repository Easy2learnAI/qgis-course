@echo off
setlocal
cd /d "%~dp0"
title Publish Delta Conception to GitHub Pages
echo.
echo   Publishing the site to GitHub (Easy2learnAI/qgis-course)
echo   ---------------------------------------------------------
where git >nul 2>&1 || (echo   Git is not installed or not in PATH. & goto :end)

rem 1) keep the protected exercise data out of the public repository
git rm -r --cached --ignore-unmatch -q _materials >nul 2>&1

rem 2) stage everything else (.gitignore excludes _materials, _private and _backup-before-claude)
git add -A
echo.
echo   Files in this update:
git status --short
echo.

rem 3) commit (skipped when there is nothing new) and push
git diff --cached --quiet && (echo   Nothing new to commit.) || git commit -q -m "Update Delta Conception website (%date% %time:~0,5%)"
git push origin main
if errorlevel 1 (
  echo.
  echo   PUSH FAILED - see the message above. Nothing was changed on GitHub.
  goto :end
)
echo.
echo   Done. GitHub Pages updates the site in about 1 minute:
echo   https://easy2learnai.github.io/qgis-course/
:end
echo.
pause
