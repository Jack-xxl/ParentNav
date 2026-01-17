# 🚀 Render Deployment Guide for ParentNavAI Backend

## Quick Setup Steps:

### 1. Create New Web Service on Render
- Go to https://render.com/dashboard
- Click "New +" → "Web Service"
- Connect your GitHub account and select `Jack-xxl/ParentNav` repository

### 2. Configuration Settings:
```
Name: parentnav-backend
Environment: Node
Region: Oregon (US West) or Frankfurt (Europe) - choose closest to your users
Branch: main
Root Directory: ParentNavBackend
Build Command: npm install
Start Command: npm start
```

### 3. Environment Variables (CRITICAL):
Add these in the Render dashboard under "Environment Variables":

```
QIANWEN_API_KEY=sk-53aec2c0a7cd48a2bd50a47925628b0f
NODE_ENV=production
JWT_SECRET=65b1b12a8ef98d8306b4ad4b7f24e9cf1a4df9995b7eb37b12874f9e1e237595666e2e4c88741b2e008572e01143ef49b52f518afae438e138ade7a717a79181
FRONTEND_URL=https://parentnavai.com
PORT=8888
```

### 4. Advanced Settings:
- Auto-Deploy: Yes (deploys automatically on GitHub push)
- Health Check Path: `/health`

### 5. After Deployment:
- Note your Render URL (e.g., `https://parentnav-backend-xyz.onrender.com`)
- Test the health endpoint: `https://your-render-url/health`
- Update your frontend environment variable `VITE_API_URL` to point to this URL

### 6. Custom Domain (Optional):
- Add `api.parentnavai.com` in Render dashboard
- Update DNS: CNAME `api` → `parentnav-backend-xyz.onrender.com`

## ✅ Security Features Already Included:
- Rate limiting (100 req/15min, 10 AI req/min)
- Helmet security headers
- CORS protection
- Input validation
- Error handling
- Environment variable protection

## 🔧 Troubleshooting:
- Check logs in Render dashboard
- Verify all environment variables are set
- Ensure GitHub repository is connected
- Test `/health` endpoint for server status

Your backend will be available at the generated Render URL!
