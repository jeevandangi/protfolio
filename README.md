# Jeevan Dangi - Portfolio Website

A modern, full-stack portfolio website built with React, Node.js, Express, and MongoDB.

## 🚀 Features

- **Modern Design**: Clean, responsive design with dark theme and animations
- **Full-Stack**: Complete frontend and backend with REST API
- **Admin Panel**: Content management system for skills, projects, blogs, and messages
- **Blog System**: Full-featured blog with categories, tags, and search
- **Contact Form**: Functional contact form with message management
- **Authentication**: Secure JWT-based admin authentication
- **Responsive**: Mobile-first design that works on all devices

## 🛠️ Tech Stack

### Frontend
- React 19
- Vite
- Tailwind CSS
- Framer Motion
- React Router
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- bcryptjs
- CORS

## 📦 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm

### 1. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run create-admin
npm start
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### 3. Build for Production

```bash
# Frontend
cd frontend
npm run build

# Backend is production-ready with npm start
```

## 🌐 Deployment

### Quick Deploy Options

#### **Frontend Hosting (Free)**
- **Vercel** (Recommended): Connect GitHub repo, auto-deploy
- **Netlify**: Drag & drop `frontend/dist` folder
- **GitHub Pages**: Enable in repo settings

#### **Backend Hosting (Free Tier)**
- **Railway**: Connect GitHub, auto-deploy backend folder
- **Render**: Connect GitHub, set build command
- **Heroku**: Git push deployment

#### **Database**
- **MongoDB Atlas**: Free 512MB cluster
- **Connection String**: Update `MONGODB_URI` in production

### Step-by-Step Deployment

#### **1. Frontend (Vercel)**
```bash
# Build locally first
cd frontend
npm run build

# Deploy to Vercel
1. Push to GitHub
2. Import project in Vercel
3. Set build command: npm run build
4. Set output directory: dist
5. Deploy!
```

#### **2. Backend (Railway)**
```bash
# Deploy to Railway
1. Push to GitHub
2. Create new project in Railway
3. Connect GitHub repo
4. Set root directory: backend
5. Add environment variables
6. Deploy!
```

#### **3. Environment Variables (Production)**
Set these in your hosting platform:
```env
MONGODB_URI=your-mongodb-atlas-connection-string
JWT_SECRET=your-secure-jwt-secret
FRONTEND_URL=https://your-frontend-domain.vercel.app
ADMIN_EMAIL=admin@portfolio.com
ADMIN_PASSWORD=your-secure-password
```

## 📱 Usage

- **Public Site**: Portfolio, projects, blog, contact
- **Admin Panel**: `/admin` - Manage all content
- **API**: RESTful endpoints for all data

## 👨‍💻 Author

**Jeevan Dangi** - Full Stack Developer

## 📄 License

MIT License
