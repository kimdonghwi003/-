@echo off
cd /d "%~dp0"
echo [VocalAI] Adding and committing changes...
git add .
git commit -m "feat: massive expansion to 600 songs DB incorporating NamuWiki extreme high pitch (4th/5th octaves) and low pitch masterpieces (v=42)"
echo.
echo [VocalAI] Pushing to GitHub...
git push origin main
echo.
echo Push completed! Press any key to close.
pause > nul
