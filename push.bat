@echo off
cd /d "%~dp0"
echo [VocalAI] Adding and committing changes...
git add .
git commit -m "feat: add interactive audio player with diagnostic timestamps bookmarks (off-beat & shaky pitch) for student/trainer collaboration (v=31)"
echo.
echo [VocalAI] Pushing to GitHub...
git push origin main
echo.
echo Push completed! Press any key to close.
pause > nul
