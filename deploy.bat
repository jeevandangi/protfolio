@echo off
echo 🚀 Starting production deployment...

echo 📦 Building frontend...
cd frontend
call npm ci --production
call npm run build
cd ..

echo 🔧 Preparing backend...
cd backend
call npm ci --production

echo 👤 Creating admin user...
call npm run create-admin

echo ✅ Deployment preparation complete!
echo.
echo Next steps:
echo 1. Deploy backend to your hosting service
echo 2. Deploy frontend/dist to your static hosting
echo 3. Update environment variables in production
echo.
echo 🌐 Your portfolio is ready for production!
pause
