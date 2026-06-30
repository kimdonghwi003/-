@echo off
cd /d "%~dp0"
echo [VocalAI] Adding and committing changes...
git add .
git commit -m "feat: enforce high-security encryption for user emails and strong 256-bit hashing for passwords stored in Supabase database (v=26)"
echo.
echo [VocalAI] Pushing to GitHub...
git push origin main
echo.
echo Push completed! Press any key to close.
pause > nul
