@echo off
title Restart Backend Server
color 0C

echo.
echo ========================================
echo   RESTARTING BACKEND SERVER
echo ========================================
echo.

echo Step 1: Stopping old backend...
FOR /F "tokens=5" %%P IN ('netstat -ano ^| findstr :8000') DO (
    echo Killing process %%P...
    taskkill /PID %%P /F >nul 2>&1
)

echo [OK] Old backend stopped
echo.

timeout /t 2 /nobreak >nul

echo Step 2: Starting new backend...
cd backend

start "Backend Server - DO NOT CLOSE" cmd /k "echo ======================================== && echo    BACKEND SERVER RUNNING && echo ======================================== && echo. && echo Backend URL: http://localhost:8000 && echo API Docs: http://localhost:8000/docs && echo. && echo Press Ctrl+C to stop && echo. && python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo [OK] Backend restarted!
echo.
echo Backend URL: http://localhost:8000
echo API Docs: http://localhost:8000/docs
echo.
echo ========================================
echo.
pause
