@echo off
cd /d "%~dp0"
echo [VocalAI] Adding and committing changes...
git add .
git commit -m "feat: enhance STT lyrics recognition for Na Yoon Kwon Nayotseumyeon and concrete pitch timeline analysis"
echo.
echo [VocalAI] Pushing to GitHub...
git push origin main
echo.
echo Push completed! Press any key to close.
pause > nul
