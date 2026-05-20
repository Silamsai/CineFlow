const { Server } = require('socket.io');
const logger = require('../utils/logger');

const EVENTS = {
  SEAT_BOOKED: 'seat-booked',
  SEAT_RELEASED: 'seat-released',
  SEAT_HELD: 'seat-held',
  PAYMENT_CONFIRMED: 'payment-confirmed',
  BOOKING_CANCELLED: 'booking-cancelled',
  SHOW_STARTING_SOON: 'show-starting-soon',
};

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    logger.info(`🔌 Socket connected: ${socket.id}`);

    // Join a show room to get real-time seat updates
    socket.on('join-show', (showId) => {
      socket.join(`show-${showId}`);
      logger.info(`Socket ${socket.id} joined show-${showId}`);
    });

    socket.on('leave-show', (showId) => {
      socket.leave(`show-${showId}`);
    });

    // Join admin room for dashboard metrics
    socket.on('join-admin', () => {
      socket.join('admin-room');
    });

    socket.on('disconnect', () => {
      logger.info(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return { EVENTS };
};

// Helper to emit seat updates to a show room
const emitSeatUpdate = (io, showId, eventType, data) => {
  io.to(`show-${showId}`).emit(eventType, data);
};

// Helper to emit to admin room
const emitAdminUpdate = (io, eventType, data) => {
  io.to('admin-room').emit(eventType, data);
};

module.exports = { setupSocket, emitSeatUpdate, emitAdminUpdate, EVENTS };
