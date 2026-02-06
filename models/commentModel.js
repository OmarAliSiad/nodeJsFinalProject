// 1.1 Comment Model
// Create models/comments.js
// Fields:
// content (String, required, min: 1, max: 1000)
// postId (ObjectId, ref: 'Post', required)
// userId (ObjectId, ref: 'User', required)
// parentCommentId (ObjectId, ref: 'Comment', optional) - For nested replies
// likes (Number, default: 0)
// isEdited (Boolean, default: false)
// editedAt (Date, optional)
// timestamps (enabled)
//Optionally add likedBy array for quick access (consider performance)


const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true, minlength: 1, maxlength: 1000 },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    parentCommentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
    likes: { type: Number, default: 0 },
    isEdited: { type: Boolean, default: false },
    editedAt: { type: Date, default: null },
    likedBy: { type: [String], default: [] }
}, { timestamps: true });

//Comment model: postId, userId, parentCommentId
commentSchema.index({ postId: 1 });
commentSchema.index({ userId: 1 });
commentSchema.index({ parentCommentId: 1 });

// Model
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
