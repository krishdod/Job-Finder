# 🚀 Job Finder Deployment Guide

This guide will help you deploy your Job Finder application to **Render** (backend) and **Vercel** (frontend).

## 📋 Pre-Deployment Checklist

### Issues Fixed:
✅ **Backend Issues Fixed:**
- Added proper CORS configuration for production
- Created startup script (`start.py`) for Render
- Fixed SerpAPI integration with direct HTTP requests
- Added environment variable handling
- Created `render.yaml` configuration

✅ **Frontend Issues Fixed:**
- Updated HTML title from "Vite + React" to "Job Finder"
- Increased API timeout from 60s to 120s for job searches
- Added proper meta tags for SEO
- Created `vercel.json` configuration
- Added Content-Type header for file uploads

## 🔧 Part 1: Deploy Backend to Render

### Step 1: Prepare Your Backend
1. Navigate to your backend directory:
   ```bash
   cd "C:\Job Finder\backend"
   ```

2. Your backend now has these key files:
   - `main.py` - FastAPI application
   - `agent.py` - Job search logic
   - `requirements.txt` - Dependencies
   - `start.py` - **NEW** Render startup script
   - `render.yaml` - **NEW** Render configuration
   - `.env` - Environment variables (don't commit this!)

### Step 2: Create GitHub Repository
1. Create a new repository on GitHub
2. Upload your backend code:
   ```bash
   git init
   git add .
   git commit -m "Initial backend commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/job-finder-backend.git
   git push -u origin main
   ```

### Step 3: Deploy to Render
1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `job-finder-api`
   - **Environment**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `python start.py`

### Step 4: Set Environment Variables in Render
1. In your Render dashboard, go to your service
2. Go to "Environment" tab
3. Add these environment variables:
   ```
   ENVIRONMENT=production
   RAPIDAPI_KEY=747d9fb20cmsh41a3e6c8b23b606p1b7ffdjsn02f916ed95bb
   SERPAPI_KEY=0fa3494b475c8b42f2ad60faf9477b6340452842dcb3548b29779826e614ff3d
   ```

### Step 5: Test Backend
Once deployed, test your backend:
- Health check: `https://your-service-name.onrender.com/health`
- API docs: `https://your-service-name.onrender.com/docs`

## 🎨 Part 2: Deploy Frontend to Vercel

### Step 1: Prepare Your Frontend
1. Navigate to your frontend directory:
   ```bash
   cd "C:\Job Finder\Frontend_new\vite-project"
   ```

2. Update your `.env` file with your Render backend URL:
   ```env
   VITE_API_BASE=https://your-service-name.onrender.com
   ```

3. Your frontend now has these key files:
   - `src/App.jsx` - Main application
   - `src/components/ResumeForm.jsx` - **UPDATED** with better timeout
   - `index.html` - **UPDATED** with proper title and meta tags
   - `vercel.json` - **NEW** Vercel configuration
   - `.env.example` - **NEW** Environment template

### Step 2: Build and Test Locally
```bash
npm install
npm run build
npm run preview
```

### Step 3: Create GitHub Repository for Frontend
```bash
git init
git add .
git commit -m "Initial frontend commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/job-finder-frontend.git
git push -u origin main
```

### Step 4: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

### Step 5: Set Environment Variables in Vercel
1. In your Vercel dashboard, go to your project
2. Go to "Settings" → "Environment Variables"
3. Add:
   ```
   VITE_API_BASE=https://your-render-service-name.onrender.com
   ```

### Step 6: Update CORS in Backend
1. Go back to your backend code
2. Update the `allowed_origins` in `main.py`:
   ```python
   allowed_origins = [
       "http://localhost:3000",
       "http://localhost:5173",
       "https://your-vercel-app-name.vercel.app",  # Add your Vercel URL
       "https://*.vercel.app",
   ]
   ```
3. Commit and push the changes to trigger a new Render deployment

## 🧪 Testing Your Deployment

### Test the Complete Flow:
1. Visit your Vercel URL
2. Upload a PDF/DOCX resume
3. Set location (e.g., "United States")
4. Click "Find Jobs"
5. Wait for results (may take 1-2 minutes)

### Expected Results:
- Should see jobs from RapidAPI and DuckDuckGo
- Each job should have title, company, location, description
- Apply links should work

## 🐛 Troubleshooting

### Common Issues:

**1. CORS Errors:**
- Make sure your Vercel URL is in the `allowed_origins` list
- Check that both HTTP and HTTPS variants are included

**2. API Timeout:**
- Frontend timeout is set to 120 seconds
- If still timing out, the job search APIs might be slow

**3. File Upload Issues:**
- Ensure Content-Type header is set correctly
- Check file size limits (10MB max)

**4. Environment Variables:**
- Make sure all env vars are set in both Render and Vercel
- Don't include quotes around values

**5. Build Failures:**
- Check that all dependencies are in `requirements.txt`
- Ensure Python version compatibility

## 📊 Performance Notes

### Backend Performance:
- Free Render services may have cold starts
- Job search can take 30-120 seconds depending on APIs
- RapidAPI provides faster, more structured results
- DuckDuckGo provides additional job listings

### Frontend Performance:
- Vercel provides excellent performance for React apps
- Images and assets are automatically optimized
- CDN ensures fast global delivery

## 🔐 Security Considerations

### API Keys:
- Never commit `.env` files to Git
- Use Render and Vercel environment variable settings
- Rotate API keys periodically

### CORS:
- Production CORS is restricted to your domains
- Don't use wildcard (*) in production

## 📈 Monitoring and Logs

### Render Logs:
- View logs in Render dashboard under "Logs" tab
- Monitor for API errors and performance issues

### Vercel Analytics:
- Enable Vercel Analytics for frontend monitoring
- Track user interactions and performance

---

## 🎉 Congratulations!

Your Job Finder application is now deployed and ready to use! Users can upload their resumes and get AI-powered job recommendations in real-time.

### Next Steps:
1. Test with different resume types
2. Monitor performance and usage
3. Consider adding features like job saving, email alerts, etc.
4. Scale up your Render service if needed for better performance
