# 📚 Skill Bridge Platform

A full-stack skill exchange web application built with React + Node.js + MongoDB.

## 🚀 Features
- ✅ User Registration & Login (JWT Auth)
- ✅ Profile Creation & Management
- ✅ Add / Remove Skills (Offered & Wanted)
- ✅ Skill Search & Browse
- ✅ Skill Categories & Filters
- ✅ View User Profiles
- ✅ Skill Exchange Request
- ✅ Real-time Chat System
- ✅ Session Scheduling (with Calendar)
- ✅ Ratings & Reviews
- ✅ Admin Management panel

## 📁 Project Structure
```
E:\SkillBridge\
├── backend\          ← Node.js + Express API
│   ├── config\
│   ├── middleware\
│   ├── models\
│   ├── routes\
│   └── server.js
└── frontend\         ← React + Vite app
    ├── src\
    │   ├── api\
    │   ├── components\
    │   ├── context\
    │   └── pages\
    └── index.html
```

## ⚙️ Setup Instructions

### Step 1 — Prerequisites
Make sure these are installed on your computer:
- **Node.js** v18+ → https://nodejs.org
- **Git** → https://git-scm.com (optional)
- **MongoDB Atlas** → https://cloud.mongodb.com (free cloud DB)

### Step 2 — MongoDB Atlas Setup
1. Go to https://cloud.mongodb.com and create a FREE account
2. Create a new project → Create a FREE M0 cluster
3. Click **Connect** → **Drivers** → copy the connection string
4. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`
5. Add your database name at the end: `...mongodb.net/skillbridge`
6. Go to **Network Access** → Add IP `0.0.0.0/0` (allow all)

### Step 3 — Backend Setup
Open terminal/PowerShell and run:
```bash
cd E:\SkillBridge\backend

# Copy env file and fill in your MongoDB URI
copy .env.example .env

# Open .env and update:
# MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.xxxxx.mongodb.net/skillbridge
# JWT_SECRET=any_long_random_string_here
# CLIENT_URL=http://localhost:5173

# Install dependencies
npm install

# Start backend (development)
npm run dev
```
Backend will run on → http://localhost:5000

### Step 4 — Frontend Setup
Open a NEW terminal and run:
```bash
cd E:\SkillBridge\frontend

# Copy env file
copy .env.example .env

# Open .env and set:
# VITE_API_URL=http://localhost:5000/api

# Install dependencies
npm install

# Start frontend
npm run dev
```
Frontend will open at → http://localhost:5173

### Step 5 — Create Admin Account
1. Register normally at http://localhost:5173/register
2. Open MongoDB Atlas → Browse Collections → users
3. Find your user → change `role` field from `"user"` to `"admin"`
4. Log back in — Admin Panel will appear in sidebar!

---

## 🌐 Deployment

### Deploy Backend to Render (Free)
1. Go to https://render.com → Sign up
2. New → Web Service → Connect GitHub repo (or upload files)
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Add Environment Variables:
   - `MONGO_URI` = your MongoDB connection string
   - `JWT_SECRET` = your secret key
   - `NODE_ENV` = production
   - `CLIENT_URL` = your Vercel URL (e.g. https://skillbridge.vercel.app)
6. Deploy → copy your Render URL (e.g. https://skillbridge-api.onrender.com)

### Deploy Frontend to Vercel (Free)
1. Go to https://vercel.com → Sign up
2. New Project → Import from GitHub or upload frontend folder
3. Framework: **Vite**
4. Add Environment Variable:
   - `VITE_API_URL` = https://skillbridge-api.onrender.com/api
5. Deploy!

---

## 🎨 Tech Stack
| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Routing | React Router v6 |
| HTTP | Axios |
| Backend | Node.js + Express |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Styling | Pure CSS Variables |
| Fonts | Syne + DM Sans |

## 👤 Default Test Credentials
After registering and manually setting role to admin in MongoDB:
- Email: your registered email
- Password: your registered password

this is a test push