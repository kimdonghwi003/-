@echo off
cd /d "%~dp0"
echo [VocalAI] Adding and committing changes...
git add .
git commit -m "style: replace practice song analysis input wording from '부르신 곡명 선택/입력' to '원곡 가수의 노래 입력' (v=30)"
echo.
echo [VocalAI] Pushing to GitHub...
git push origin main
echo.
echo Push completed! Press any key to close.
pause > nul
