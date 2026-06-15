@echo off
echo ========================================
echo   Portfolio Development Server
echo ========================================
echo.
echo Starting backend and frontend servers...
echo.
echo Backend will run on: http://localhost:5000
echo Frontend will run on: http://localhost:5173
echo Admin panel: http://localhost:5173/admin
echo.
echo Press Ctrl+C to stop all servers
echo.

start "Backend Server" cmd /k "npm run server:dev"
timeout /t 2 /nobreak >nul
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting in separate windows...
echo.
pause
