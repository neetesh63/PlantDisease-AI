@echo off
title Plant Disease AI - Backend Server
echo ===================================================
echo   Starting FastAPI Backend on http://localhost:8000
echo ===================================================
cd /d "%~dp0"
call .\env\Scripts\activate.bat
uvicorn backend_server.api_main:app --host 0.0.0.0 --port 8000 --reload
pause
