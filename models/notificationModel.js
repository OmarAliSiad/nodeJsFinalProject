const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['comment', 'like', 'follow', 'reply'],
        required: true
    },
    relatedUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    relatedPostId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Posts'
    },
    relatedCommentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    read: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

// Indexes for efficient querying
notificationSchema.index({ userId: 1, read: 1 });
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ read: 1 });

// Model
const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
