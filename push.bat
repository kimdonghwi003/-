@echo off
cd /d "%~dp0"
echo [VocalAI] Adding and committing changes...
git add .
git commit -m "feat: add AI precision diagnosis for 1st & 2nd weakest vocal evaluation criteria and customized 1:1 trainer matching (v=36)"
echo.
echo [VocalAI] Pushing to GitHub...
git push origin main
echo.
echo Push completed! Press any key to close.
pause > nul
