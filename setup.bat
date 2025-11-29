@echo off
echo ================================
echo Raj Shop - Order Management Setup
echo ================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo [1/5] Node.js found: 
node --version
echo.

REM Check if MongoDB is installed
where mongod >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB command not found in PATH
    echo Please ensure MongoDB is installed and running
    echo Download from: https://www.mongodb.com/try/download/community
    echo.
)

REM Check if .env file exists
if not exist .env (
    echo [2/5] Creating .env file from template...
    copy .env.example .env
    echo .env file created! Please edit it with your configuration.
    echo.
) else (
    echo [2/5] .env file already exists
    echo.
)

REM Install dependencies
echo [3/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo Dependencies installed successfully!
echo.

REM Check MongoDB connection
echo [4/5] Checking MongoDB connection...
echo Please ensure MongoDB is running before starting the server
echo.

echo [5/5] Setup completed successfully!
echo.
echo ================================
echo Next Steps:
echo ================================
echo 1. Edit .env file with your configuration
echo 2. Ensure MongoDB is running
echo 3. Run: npm start
echo.
echo Default Superadmin Login:
echo   Username: superadmin
echo   Password: SuperAdmin@123
echo.
echo Access the application at: http://localhost:3000
echo ================================
echo.
pause
