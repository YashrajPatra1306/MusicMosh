@echo off
echo ========================================
echo   Music Mosh MAX - Deploy to Vercel
echo ========================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI not found. Installing...
    echo.
    call npm install -g vercel
    if %ERRORLEVEL% NEQ 0 (
        echo Failed to install Vercel CLI.
        echo Please install manually: npm install -g vercel
        pause
        exit /b 1
    )
)

echo Deploying to Vercel...
echo.
echo Options:
echo   1. Deploy to preview URL (recommended for testing)
echo   2. Deploy to production
echo.
set /p choice="Enter choice (1 or 2): "

if "%choice%"=="1" (
    echo Deploying preview...
    vercel --yes
) else if "%choice%"=="2" (
    echo Deploying to production...
    vercel --prod --yes
) else (
    echo Invalid choice. Deploying preview...
    vercel --yes
)

echo.
echo ========================================
echo   Deployment complete!
echo ========================================
pause
