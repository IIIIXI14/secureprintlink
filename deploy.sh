#!/bin/bash

echo "🚀 Secure Print Link - Deployment Script"
echo "========================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

echo "📦 Building frontend..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend built successfully!"

echo "🔧 Installing server dependencies..."
cd server
npm install

if [ $? -ne 0 ]; then
    echo "❌ Server dependencies installation failed!"
    exit 1
fi

echo "✅ Server dependencies installed!"

echo "📋 Checking deployment files..."
cd ..

if [ -f "railway.json" ]; then
    echo "✅ Railway configuration found"
fi

if [ -f "Procfile" ]; then
    echo "✅ Heroku configuration found"
fi

echo ""
echo "🎯 Deployment Options:"
echo "1. Railway (Recommended) - Full stack deployment"
echo "2. Vercel + Railway - Separate frontend/backend"
echo "3. Netlify + Render - Free tier option"
echo ""
echo "📖 See deployment-guide.md for detailed instructions"
echo ""
echo "🚀 Ready to deploy! Choose your platform and follow the guide."
echo ""
echo "💡 Quick Railway deployment:"
echo "1. Push to GitHub: git add . && git commit -m 'Deploy ready' && git push"
echo "2. Go to railway.app and connect your repo"
echo "3. Deploy automatically!"
