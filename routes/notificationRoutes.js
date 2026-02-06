const express = require('express');
const router = express.Router();
const notificationsController = require('../controllers/notificationsController');
const authenticate = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { getNotificationsSchema, markAsReadSchema } = require('../sechemas/notificationSchema');

// Get user's notifications
router.get('/', authenticate, validate(getNotificationsSchema), notificationsController.getUserNotifications);

// Mark notification as read
router.patch('/:id/read', authenticate, validate(markAsReadSchema), notificationsController.markAsRead);

// Mark all notifications as read
router.patch('/read-all', authenticate, notificationsController.markAllAsRead);

// Delete notification
router.delete('/:id', authenticate, validate(markAsReadSchema), notificationsController.deleteNotification);

module.exports = router;
