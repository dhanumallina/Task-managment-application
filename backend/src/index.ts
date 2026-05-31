import http from 'http';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import { Server } from 'socket.io';

import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import { setupSocket } from './sockets/index.js';

// Route Imports
import authRoutes from './routes/auth.routes.js';
import taskRoutes from './routes/task.routes.js';
import userRoutes from './routes/user.routes.js';
import notificationRoutes from './routes/notification.routes.js';

const app = express();
const server = http.createServer(app);

// ── Rate Limiting ────────────────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(helmet());
// ── CORS Configuration ────────────────────────────────────────────────────────
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [env.CORS_ORIGIN, 'http://localhost:3000', 'http://127.0.0.1:3000'];
    if (!origin || env.NODE_ENV !== 'production' || allowedOrigins.includes(origin) || origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
};

// ── Middlewares ──────────────────────────────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(mongoSanitize());

if (env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
  });
}

// Apply rate limiter to all api routes
app.use('/api/', limiter);

// ── Socket.io Setup ──────────────────────────────────────────────────────────
const io = new Server(server, {
  cors: corsOptions,
});

const socketEmitters = setupSocket(io);
app.set('io', io);
app.set('socketEmitters', socketEmitters);

// ── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'UP',
    timestamp: new Date(),
    environment: env.NODE_ENV,
  });
});

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notifications', notificationRoutes);

// ── 404 Route ────────────────────────────────────────────────────────────────
app.use('*', (_req, res) => {
  res.status(404).json({
    success: false,
    message: 'API resource not found.',
  });
});

// ── Error Handling ───────────────────────────────────────────────────────────
app.use(errorHandler);

// ── Server Start ─────────────────────────────────────────────────────────────
const PORT = env.PORT;

async function startServer() {
  await connectDB();
  server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(` Lumio Server running in ${env.NODE_ENV} mode`);
    console.log(` Local URL: http://localhost:${PORT}`);
    console.log(` Socket.io Server active`);
    console.log(`===============================================`);
  });
}

startServer();

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Shutting down gracefully...');
  server.close(async () => {
    console.log('HTTP server closed.');
    await disconnectDB();
    process.exit(0);
  });
});

process.on('unhandledRejection', (err: any) => {
  console.error('[UNHANDLED REJECTION] Shutting down...', err);
  process.exit(1);
});
