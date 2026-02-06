//Create services/bookmarks.js with CRUD operations
const bookmark = require('../models/bookmarkModel');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/AppError');

// Create a bookmark
const createBookmark = asyncHandler(async (userId, postId) => {
    const newBookmark = await bookmark.create({ userId, postId });
    return newBookmark;
});

// Get bookmarks for a user
const getBookmarksByUser = asyncHandler(async (userId) => {
    const bookmarks = await bookmark.find({ userId }).populate('postId');
    return bookmarks;
});

// Delete a bookmark
const deleteBookmark = asyncHandler(async (userId, postId) => {
    const result = await bookmark.findOneAndDelete({ userId, postId });
    if (!result) {
        throw new AppError('Bookmark not found', 404);
    }
    return result;
});

module.exports = {
    createBookmark,
    getBookmarksByUser,
    deleteBookmark
};