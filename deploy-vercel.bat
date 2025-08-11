@echo off
echo 🚀 Secure Print Link - Vercel Deployment Script
echo ===============================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

echo 📦 Building frontend for Vercel...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo ✅ Frontend built successfully!

echo 📋 Checking Vercel configuration...
if exist "vercel.json" (
    echo ✅ Vercel configuration found
) else (
    echo ❌ Vercel configuration missing!
    pause
    exit /b 1
)

echo.
echo 🎯 Vercel Deployment Ready!
echo.
echo 📖 Next Steps:
echo 1. Go to vercel.com and sign up/login
echo 2. Click "New Project"
echo 3. Import your GitHub repository: secureprintlink
echo 4. Configure settings:
echo    - Framework: Create React App
echo    - Build Command: npm run build
echo    - Output Directory: build
echo    - Install Command: npm install
echo 5. Add Environment Variables:
echo    - REACT_APP_API_URL: https://your-backend-url.com
echo 6. Click Deploy!
echo.
echo 📚 See VERCEL-DEPLOYMENT-GUIDE.md for detailed instructions
echo.
pause
