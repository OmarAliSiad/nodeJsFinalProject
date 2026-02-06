// 2.1 Like Model
// Create models/likes.js
// Fields:
// userId (ObjectId, ref: 'User', required)
// targetType (String, enum: ['Post', 'Comment'], required)
// targetId (ObjectId, required) - Reference to Post or Comment
// timestamps (enabled)
// Compound index on userId, targetType, targetId (unique)
const mongoose = require('mongoose');

const likeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, enum: ['Post', 'Comment'], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true }
}, { timestamps: true });

// Compound index to ensure a user can like a specific target only once
likeSchema.index({ userId: 1, targetType: 1, targetId: 1 }, { unique: true });

// Model
const Like = mongoose.model('Like', likeSchema);
module.exports = Like;