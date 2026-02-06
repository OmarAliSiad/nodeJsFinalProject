const notificationService = require('../services/notificationService');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Get user's notifications
const getUserNotifications = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId || req.user.id;
    const { limit, page, read } = req.query;

    const result = await notificationService.getUserNotifications(userId, {
        limit,
        page,
        read
    });

    res.status(200).json(result);
});

// Mark notification as read
const markAsRead = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId || req.user.id;
    const notificationId = req.params.id;

    const notification = await notificationService.markAsRead(notificationId, userId);

    res.status(200).json({
        message: 'Notification marked as read',
        notification
    });
});

// Mark all notifications as read
const markAllAsRead = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId || req.user.id;

    const count = await notificationService.markAllAsRead(userId);

    res.status(200).json({
        message: 'All notifications marked as read',
        count
    });
});

// Delete a notification
const deleteNotification = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId || req.user.id;
    const notificationId = req.params.id;

    await notificationService.deleteNotification(notificationId, userId);

    res.status(200).json({
        message: 'Notification deleted successfully'
    });
});

module.exports = {
    getUserNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
};
