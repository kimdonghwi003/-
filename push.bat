@echo off
cd /d "%~dp0"
echo [VocalAI] Adding and committing changes...
git add .
git commit -m "fix: correct verified highest notes for 김범수 보고 싶다 and 끝사랑 based on NamuWiki/DC inside vocal data (v=37)"
echo.
echo [VocalAI] Pushing to GitHub...
git push origin main
echo.
echo Push completed! Press any key to close.
pause > nul
