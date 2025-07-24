#!/bin/bash

# Production Deployment Script for Jeevan Dangi Portfolio

echo "🚀 Starting production deployment..."

# Build Frontend
echo "📦 Building frontend..."
cd frontend
npm ci --production
npm run build
cd ..

# Prepare Backend
echo "🔧 Preparing backend..."
cd backend
npm ci --production

# Create admin user (only run once)
echo "👤 Creating admin user..."
npm run create-admin

echo "✅ Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Deploy backend to your hosting service"
echo "2. Deploy frontend/dist to your static hosting"
echo "3. Update environment variables in production"
echo ""
echo "🌐 Your portfolio is ready for production!"
