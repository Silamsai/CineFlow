const router = require('express').Router();
const { initiatePayment, verifyPayment, handleWebhook, getAllPayments, processRefund, getPaymentStats } = require('../controllers/paymentController');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireAdmin } = require('../middleware/adminMiddleware');
const { paymentLimiter } = require('../middleware/rateLimiter');

router.post('/initiate', requireAuth, paymentLimiter, initiatePayment);
router.post('/verify', requireAuth, verifyPayment);
router.post('/webhook', handleWebhook);

// Admin
router.get('/admin/all', requireAuth, requireAdmin, getAllPayments);
router.get('/admin/stats', requireAuth, requireAdmin, getPaymentStats);
router.post('/admin/:id/refund', requireAuth, requireAdmin, processRefund);

module.exports = router;
