@echo off
cd /d "%~dp0"
echo [VocalAI] Adding and committing changes...
git add .
git commit -m "feat: expand vocal song database to 300 strictly verified songs based on NamuWiki & DC Vocal Gallery octave tier lists (v=38)"
echo.
echo [VocalAI] Pushing to GitHub...
git push origin main
echo.
echo Push completed! Press any key to close.
pause > nul
