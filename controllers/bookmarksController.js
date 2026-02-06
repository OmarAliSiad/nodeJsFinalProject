const bookmarksService = require('../services/bookmarksSrivces');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

// Bookmark a post
const bookmarkPost = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId || req.user.id;
    const postId = req.params.postId;

    const bookmark = await bookmarksService.createBookmark(userId, postId);

    res.status(201).json({
        message: 'Post bookmarked successfully',
        bookmark
    });
});

// Remove bookmark
const removeBookmark = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId || req.user.id;
    const postId = req.params.postId;

    await bookmarksService.deleteBookmark(userId, postId);

    res.status(200).json({
        message: 'Bookmark removed successfully'
    });
});

// Get user's bookmarked posts
const getUserBookmarks = asyncHandler(async (req, res, next) => {
    const userId = req.user.userId || req.user.id;

    const bookmarks = await bookmarksService.getBookmarksByUser(userId);

    res.status(200).json({
        bookmarks,
        count: bookmarks.length
    });
});

module.exports = {
    bookmarkPost,
    removeBookmark,
    getUserBookmarks
};
