@echo off
cd /d "%~dp0"
echo [VocalAI] Adding and committing changes...
git add .
git commit -m "feat: menu unification, gender separation in song selection, and algorithm rename (v=46)"
echo.
echo [VocalAI] Pushing to GitHub...
git push origin main
echo.
echo Push completed! Press any key to close.
pause > nul
