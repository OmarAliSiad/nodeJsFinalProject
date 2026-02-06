/*
Create models/bookmarks.js
Fields: userId (ref: 'User'), postId (ref: 'Post'), timestamps
Compound unique index on userId and postId
*/

const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }
}, { timestamps: true });

//add indexes to: Bookmark model: userId, postId
bookmarkSchema.index({ userId: 1 });
bookmarkSchema.index({ postId: 1 });

//Compound unique index on userId and postId
bookmarkSchema.index({ userId: 1, postId: 1 }, { unique: true });

// Model
const Bookmark = mongoose.model('Bookmark', bookmarkSchema);

module.exports = Bookmark;