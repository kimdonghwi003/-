@echo off
cd /d "%~dp0"
echo [VocalAI] Adding and committing changes...
git add .
git commit -m "fix: precisely cross-verify and correct M.C the MAX (이수) highest notes for 사계, One Love, 행복하지 말아요, 입술의 말 (v=40)"
echo.
echo [VocalAI] Pushing to GitHub...
git push origin main
echo.
echo Push completed! Press any key to close.
pause > nul
