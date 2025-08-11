# 🚀 Secure Print Link - Deployment Guide

## 📋 Prerequisites

Before deploying, ensure you have:
- [Git](https://git-scm.com/) installed
- [Node.js](https://nodejs.org/) v16+ installed
- A GitHub account
- One of the deployment platform accounts (Railway, Vercel, Netlify, or Render)

## 🎯 Deployment Options

### Option 1: Railway (Recommended - Full Stack) ⭐

**Railway** is the simplest option for full-stack deployment.

#### Step 1: Prepare Your Repository
```bash
# Ensure your code is committed to GitHub
git add .
git commit -m "Prepare for deployment"
git push origin main
```

#### Step 2: Deploy on Railway
1. Go to [railway.app](https://railway.app)
2. Sign up/Login with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `secureprintlink` repository
5. Railway will automatically detect it's a Node.js app
6. Wait for build to complete (5-10 minutes)

#### Step 3: Configure Environment Variables
In Railway dashboard, go to your project → Variables tab and add:
```env
NODE_ENV=production
PORT=4000
SESSION_SECRET=your-super-secret-key-here
ENCRYPTION_KEY=your-encryption-key-here
```

#### Step 4: Get Your URL
- Railway will provide a URL like: `https://your-app-name.railway.app`
- Your app is now live! 🎉

---

### Option 2: Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Import your repository
4. Set build command: `npm run build`
5. Set output directory: `build`
6. Deploy

#### Backend on Railway
Follow Option 1 steps for the backend

#### Connect Frontend to Backend
Update your frontend API calls to use the Railway backend URL

---

### Option 3: Netlify (Frontend) + Render (Backend)

#### Frontend on Netlify
1. Go to [netlify.com](https://netlify.com)
2. Sign up/Login with GitHub
3. Import your repository
4. Set build command: `npm run build`
5. Set publish directory: `build`
6. Deploy

#### Backend on Render
1. Go to [render.com](https://render.com)
2. Sign up/Login with GitHub
3. Create new Web Service
4. Connect your repository
5. Set build command: `cd server && npm install`
6. Set start command: `cd server && npm start`
7. Deploy

---

## 🔧 Post-Deployment Configuration

### 1. Update CORS Settings
If using separate frontend/backend, update CORS in `server/src/server.js`:
```javascript
app.use(cors({
  origin: ['https://your-frontend-domain.com', 'https://your-backend-domain.com'],
  credentials: true
}));
```

### 2. Database Persistence
- **Railway**: Automatically persists data
- **Render**: Data persists between deployments
- **Vercel**: Frontend only, no database

### 3. Custom Domain (Optional)
- **Railway**: Go to Settings → Domains
- **Vercel**: Go to Settings → Domains
- **Netlify**: Go to Site Settings → Domain Management

---

## 🧪 Testing Your Deployment

### 1. Health Check
Visit: `https://your-domain.com/health`
Should return: `{"ok": true}`

### 2. Frontend Load
Visit: `https://your-domain.com`
Should load the React app

### 3. API Endpoints
Test: `https://your-domain.com/api/jobs`
Should return job data or empty array

---

## 🚨 Common Issues & Solutions

### Issue: Build Fails
**Solution**: Check Railway logs for dependency issues
```bash
# Locally test build
npm run build
cd server && npm start
```

### Issue: Database Connection Error
**Solution**: Ensure database path is correct in production
```javascript
// In server/src/server.js
const dbPath = process.env.DB_PATH || join(__dirname, '../data/secureprint.db');
```

### Issue: CORS Errors
**Solution**: Update CORS origin in backend
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*'
}));
```

### Issue: Static Files Not Loading
**Solution**: Ensure build directory path is correct
```javascript
const buildDir = join(__dirname, '../../build');
```

---

## 📊 Monitoring & Maintenance

### 1. Railway Dashboard
- View logs in real-time
- Monitor resource usage
- Set up alerts

### 2. Health Monitoring
- Use `/health` endpoint
- Set up uptime monitoring (UptimeRobot, Pingdom)

### 3. Database Backups
- Railway automatically handles this
- Consider periodic exports for critical data

---

## 🔒 Security Considerations

### 1. Environment Variables
- Never commit `.env` files
- Use strong, unique secrets
- Rotate keys periodically

### 2. CORS Configuration
- Restrict origins in production
- Don't use `*` in production

### 3. Rate Limiting
- Consider adding rate limiting middleware
- Monitor for abuse

---

## 💰 Cost Estimation

### Railway (Recommended)
- **Free Tier**: $5/month credit
- **Paid**: $0.000463 per second
- **Estimated Monthly**: $10-20 for small usage

### Vercel + Railway
- **Vercel**: Free tier available
- **Railway**: $10-20/month
- **Total**: $10-20/month

### Netlify + Render
- **Netlify**: Free tier available
- **Render**: Free tier available
- **Total**: $0/month (with limitations)

---

## 🎉 Congratulations!

Your Secure Print Link application is now deployed and accessible worldwide! 

### Next Steps:
1. Test all functionality
2. Set up monitoring
3. Configure custom domain (optional)
4. Share with users
5. Monitor performance

### Support:
- Check deployment platform documentation
- Review logs for errors
- Test locally if issues persist

---

**Happy Printing! 🖨️✨**
