# ParentNavAI - Production Deployment

## Frontend (Vercel)
1. Connect GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url`

## Backend (Render)
1. Connect GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables:
   - QIANWEN_API_KEY=sk-53aec2c0a7cd48a2bd50a47925628b0f
   - NODE_ENV=production
   - JWT_SECRET=your-secure-jwt-secret
   - PORT=8888

## Domain Setup
1. Point parentnavai.com to Vercel
2. Point api.parentnavai.com to Render (optional)

## Security Checklist
- ✅ API keys in environment variables
- ✅ CORS configured for production domains
- ✅ Rate limiting enabled
- ✅ Input validation active
- ✅ Security headers (Helmet)

## Pre-deployment Test
1. npm run build (✅ completed)
2. Test mobile responsiveness
3. Test API connectivity
4. Verify error handling
