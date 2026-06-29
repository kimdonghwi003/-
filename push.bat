@echo off
cd /d "%~dp0"
echo [VocalAI] Adding and committing changes...
git add .
git commit -m "feat: diversify evaluation criteria to 6 items (breath, tail finish, real waveform stability, pitch, pronunciation, volume) with hexagon radar chart (v=25)"
echo.
echo [VocalAI] Pushing to GitHub...
git push origin main
echo.
echo Push completed! Press any key to close.
pause > nul
