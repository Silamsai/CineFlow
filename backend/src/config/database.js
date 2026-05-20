const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  // Guard: fail fast with a clear message if MONGODB_URI is missing
  if (!process.env.MONGODB_URI) {
    logger.error('❌ MONGODB_URI environment variable is not set!');
    logger.error('   Set it in Render Dashboard → Environment → MONGODB_URI');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10s timeout for initial connection
      socketTimeoutMS: 45000,          // 45s socket timeout
    });
    logger.info(`✅ MongoDB Connected: ${conn.connection.host}`);
    logger.info(`📦 Database: ${conn.connection.name}`);
  } catch (error) {
    logger.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

mongoose.connection.on('disconnected', () => {
  logger.warn('⚠️  MongoDB disconnected. Attempting reconnect...');
});

mongoose.connection.on('reconnected', () => {
  logger.info('✅ MongoDB reconnected');
});

mongoose.connection.on('error', (err) => {
  logger.error(`❌ MongoDB error: ${err.message}`);
});

module.exports = connectDB;
