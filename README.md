# Lumio — Task Management SaaS

A premium full-stack task management application built with **Next.js 15** and **Express.js**.

🌐 **Live Demo:** [Coming Soon]
🔑 **Demo Account:** `demo@lumio.app` / `Password123`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15, React 19, TailwindCSS v4, TanStack Query |
| Backend | Express.js, TypeScript, Socket.io |
| Database | MongoDB + Mongoose |
| Auth | JWT (Access + Refresh tokens) + HTTP-only cookies |
| State | Zustand |
| Deployment | Vercel (frontend) + Render (backend) + MongoDB Atlas |

---

## Features

- ✅ Authentication (Register / Login / Logout / Refresh)
- ✅ Full Task CRUD with priorities, labels, due dates & subtasks
- ✅ Real-time updates via Socket.io
- ✅ Dashboard with stats and productivity metrics
- ✅ Analytics with charts (priority spread, status allocation)
- ✅ Calendar view of upcoming deadlines
- ✅ Notification center
- ✅ Profile management & password change
- ✅ Responsive design (mobile + desktop)

---

## Local Development

### Prerequisites
- Node.js >= 18
- MongoDB running locally (or MongoDB Atlas)

### Setup

```bash
# Clone the repo
git clone https://github.com/dhanumallina/Task-managment-application.git
cd Task-managment-application

# Install backend deps
cd backend && npm install

# Copy and fill env vars
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secrets

# Start backend
npm run dev

# In a new terminal — install frontend deps
cd ../frontend && npm install

# Start frontend
npm run dev
```

Frontend → http://localhost:3000  
Backend → http://localhost:5000

### Seed demo data
```bash
cd backend && npm run seed
```

---

## Deployment

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service**
2. Connect this GitHub repo
3. Set **Root Directory** to `backend`
4. Build Command: `npm install && npm run build`
5. Start Command: `npm run start`
6. Add environment variables from `backend/.env.example`

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import this GitHub repo
3. Set **Root Directory** to `frontend`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = `https://your-backend.onrender.com/api`
   - `NEXT_PUBLIC_SOCKET_URL` = `https://your-backend.onrender.com`
5. Deploy

### Database → MongoDB Atlas

1. Go to [mongodb.com/atlas](https://cloud.mongodb.com)
2. Create a free M0 cluster
3. Create a database user and get the connection string
4. Whitelist `0.0.0.0/0` in Network Access (for Render)
5. Set `MONGODB_URI` in Render environment variables

---

## Environment Variables

### Backend (`backend/.env`)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_ACCESS_SECRET=<random-secret>
JWT_REFRESH_SECRET=<random-secret>
JWT_ACCESS_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
CORS_ORIGIN=https://your-app.vercel.app
```

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api
NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com
```

---

## Project Structure

```
task2intern/
├── backend/                 # Express API
│   ├── src/
│   │   ├── config/          # DB, CORS, env
│   │   ├── controllers/     # Route logic
│   │   ├── middleware/      # Auth, error handler
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express routers
│   │   ├── sockets/         # Socket.io setup
│   │   ├── utils/           # Tokens, responses
│   │   ├── validators/      # Zod schemas
│   │   └── index.ts         # Entry point
│   ├── .env.example
│   └── package.json
│
├── frontend/                # Next.js app
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # UI components
│   │   ├── lib/             # Axios, store, utils
│   │   ├── providers/       # QueryProvider, AuthInitializer
│   │   └── types/           # TypeScript types
│   ├── .env.example
│   └── package.json
│
├── render.yaml              # Render deployment config
├── vercel.json              # Vercel deployment config
└── README.md
```
