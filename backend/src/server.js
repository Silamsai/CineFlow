require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const connectDB = require('./config/database');
const logger = require('./utils/logger');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { generalLimiter } = require('./middleware/rateLimiter');

// Routes
const movieRoutes = require('./routes/movieRoutes');
const theaterRoutes = require('./routes/theaterRoutes');
const showRoutes = require('./routes/showRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const server = http.createServer(app);

// ── Allowed origins (Vercel frontend + local dev) ────────────────────────────
const ALLOWED_ORIGINS = [
  'https://cine-flow.vercel.app',           // Production Vercel frontend
  'https://cineflow.vercel.app',            // Alternate Vercel domain (if any)
  process.env.FRONTEND_URL,                 // Any extra URL from Render env vars
  'http://localhost:5173',                  // Local Vite dev server
  'http://localhost:3000',                  // Local alternative
].filter(Boolean); // remove undefined entries

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. Postman, server-to-server, curl)
    if (!origin) return callback(null, true);
    if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
    logger.warn(`CORS blocked for origin: ${origin}`);
    callback(new Error(`CORS policy: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
};

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

// Make io accessible in routes via req.io
app.use((req, res, next) => { req.io = io; next(); });

// Security & Parsing
app.use(helmet());
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Pre-flight for all routes
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(morgan('combined', { stream: { write: (msg) => logger.info(msg.trim()) } }));
app.use(generalLimiter);

// ── Root route (Render health + browser check) ───────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'CineFlow Backend Running',
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Health check
app.get('/health', (req, res) => res.json({
  status: 'ok',
  timestamp: new Date().toISOString(),
  version: '1.0.0',
  mongodb: 'connected',
}));

// API Routes
app.use('/api/movies', movieRoutes);
app.use('/api/theaters', theaterRoutes);
app.use('/api/shows', showRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin/analytics', adminRoutes);

// 404 & Error handling
app.use(notFound);
app.use(errorHandler);

// Socket.io real-time events
io.on('connection', (socket) => {
  logger.info(`Socket connected: ${socket.id}`);

  socket.on('join-show', (showId) => {
    socket.join(`show-${showId}`);
    logger.info(`Socket ${socket.id} joined show-${showId}`);
  });

  socket.on('leave-show', (showId) => {
    socket.leave(`show-${showId}`);
  });

  socket.on('disconnect', () => {
    logger.info(`Socket disconnected: ${socket.id}`);
  });
});

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  server.listen(PORT, () => {
    logger.info(`🎬 CineFlow Backend running on port ${PORT}`);
    logger.info(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    logger.info(`🌐 Allowed CORS origins: ${ALLOWED_ORIGINS.join(', ')}`);
  });
};

startServer().catch((err) => {
  logger.error('Failed to start server:', err);
  process.exit(1);
});

module.exports = { app, io };
