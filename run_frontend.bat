@echo off
title Plant Disease AI - Next.js Frontend
echo ===================================================
echo   Starting Next.js Frontend on http://localhost:3000
echo ===================================================
cd /d "%~dp0\frontend_website"
npm run dev
pause
