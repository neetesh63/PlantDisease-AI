@echo off
title Push PlantDisease-AI to GitHub
echo ============================================================
echo   Push PlantDisease-AI to GitHub Repository
echo ============================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/PlantDisease-AI.git): "

if "%REPO_URL%"=="" (
    echo Error: No URL entered.
    pause
    exit /b
)

echo.
echo Adding remote origin: %REPO_URL% ...
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main

echo.
echo Pushing code to GitHub...
git push -u origin main

echo.
echo ============================================================
echo Done! Your code has been uploaded to GitHub.
echo ============================================================
pause
