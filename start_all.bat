@echo off
title Plant Disease AI - Launcher
echo ============================================================
echo   Launching Plant Disease AI (Backend + Frontend)
echo ============================================================
cd /d "%~dp0"

echo [1/2] Launching FastAPI Backend on http://localhost:8000 ...
start "Plant Disease Backend" cmd /k "run_backend.bat"

timeout /t 3 /nobreak >nul

echo [2/2] Launching Next.js Frontend on http://localhost:3000 ...
start "Plant Disease Frontend" cmd /k "run_frontend.bat"

echo.
echo Both servers are launching!
echo Backend API Docs: http://localhost:8000/docs
echo Web Interface   : http://localhost:3000
echo ============================================================
pause
