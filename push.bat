@echo off
cd /d "%~dp0"
echo [VocalAI] Adding and committing changes...
git add .
git commit -m "feat: expand DB to 450 songs by learning and incorporating 150 verified masterpiece tracks from Instiz vocal tier tables across all octave ranges with exact genre analysis (v=41)"
echo.
echo [VocalAI] Pushing to GitHub...
git push origin main
echo.
echo Push completed! Press any key to close.
pause > nul
