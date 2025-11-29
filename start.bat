@echo off
echo Starting Raj Shop Order Management System...
echo.

REM Check if .env exists
if not exist .env (
    echo ERROR: .env file not found!
    echo Please run setup.bat first or copy .env.example to .env
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist node_modules (
    echo ERROR: Dependencies not installed!
    echo Please run: npm install
    pause
    exit /b 1
)

REM Start the server
echo Starting server...
echo.
echo Access the application at: http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
node server.js
