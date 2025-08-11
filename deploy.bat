@echo off
echo 🚀 Secure Print Link - Deployment Script
echo ========================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: Please run this script from the project root directory
    pause
    exit /b 1
)

echo 📦 Building frontend...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Frontend build failed!
    pause
    exit /b 1
)

echo ✅ Frontend built successfully!

echo 🔧 Installing server dependencies...
cd server
call npm install

if %errorlevel% neq 0 (
    echo ❌ Server dependencies installation failed!
    pause
    exit /b 1
)

echo ✅ Server dependencies installed!

echo 📋 Checking deployment files...
cd ..

if exist "railway.json" (
    echo ✅ Railway configuration found
)

if exist "Procfile" (
    echo ✅ Heroku configuration found
)

echo.
echo 🎯 Deployment Options:
echo 1. Railway (Recommended) - Full stack deployment
echo 2. Vercel + Railway - Separate frontend/backend
echo 3. Netlify + Render - Free tier option
echo.
echo 📖 See deployment-guide.md for detailed instructions
echo.
echo 🚀 Ready to deploy! Choose your platform and follow the guide.
echo.
echo 💡 Quick Railway deployment:
echo 1. Push to GitHub: git add . ^&^& git commit -m "Deploy ready" ^&^& git push
echo 2. Go to railway.app and connect your repo
echo 3. Deploy automatically!
echo.
pause
