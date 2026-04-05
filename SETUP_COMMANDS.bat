@echo off
echo ========================================
echo   SKILL BRIDGE - SETUP SCRIPT
echo ========================================

echo.
echo [1/4] Setting up Backend...
cd /d E:\SkillBridge\backend
copy .env.example .env
echo.
echo *** IMPORTANT: Open E:\SkillBridge\backend\.env and fill in your MONGO_URI ***
echo.
npm install
echo Backend dependencies installed!

echo.
echo [2/4] Setting up Frontend...
cd /d E:\SkillBridge\frontend
copy .env.example .env
npm install
echo Frontend dependencies installed!

echo.
echo ========================================
echo   SETUP COMPLETE!
echo ========================================
echo.
echo To START the app, run START_APP.bat
echo.
pause
