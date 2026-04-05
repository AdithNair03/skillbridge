@echo off
echo Starting Skill Bridge Platform...
echo.

start "Skill Bridge - Backend" cmd /k "cd /d E:\SkillBridge\backend && npm run dev"
timeout /t 3 /nobreak >nul
start "Skill Bridge - Frontend" cmd /k "cd /d E:\SkillBridge\frontend && npm run dev"
timeout /t 4 /nobreak >nul
start "" "http://localhost:5173"

echo.
echo ✅ Both servers started!
echo    Backend:  http://localhost:5000
echo    Frontend: http://localhost:5173
echo.
pause
