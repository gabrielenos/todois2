@echo off
title Check Backend Status
color 0A

echo.
echo ========================================
echo   CHECKING BACKEND STATUS
echo ========================================
echo.

REM Check if port 8000 is in use
netstat -ano | findstr :8000 >nul 2>&1

if %errorlevel% equ 0 (
    echo [OK] Backend is RUNNING on port 8000
    echo.
    echo Backend URL: http://localhost:8000
    echo API Docs: http://localhost:8000/docs
    echo.
    
    REM Try to get health status
    curl -s http://localhost:8000/health >nul 2>&1
    if %errorlevel% equ 0 (
        echo [OK] Backend is HEALTHY
    ) else (
        echo [WARNING] Backend port is open but not responding
    )
) else (
    echo [X] Backend is NOT RUNNING
    echo.
    echo To start backend, run: START-BACKEND.bat
)

echo.
echo ========================================
echo.
pause
