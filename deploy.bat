@echo off
echo ========================================
echo   Job Finder - Deployment Script
echo ========================================

echo.
echo 1. Adding all files to Git...
git add .

echo.
echo 2. Committing changes...
git commit -m "Fixed backend CORS, error handling, and deployment configuration - %date% %time%"

echo.
echo 3. Pushing to GitHub...
git push origin main

echo.
echo ========================================
echo   Deployment completed!
echo   - Check Render: https://dashboard.render.com/web/srv-d258n9ngi27c73bqbstg
echo   - Check Vercel: https://vercel.com/krishs-projects-808bd679/job-finder
echo ========================================

pause
