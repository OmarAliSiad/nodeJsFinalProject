const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const bookmarksController = require('../controllers/bookmarksController');
const authenticate = require('../middlewares/authMiddleware.js');
const restrictTo = require('../middlewares/restrictTo.js');

const {
    createPostSchema, getAllPostSchema, updatePostSchema
} = require('../sechemas/postSchema.js');
const { searchPostsSchema } = require('../sechemas/searchSchema.js');
const { getDraftsSchema, publishDraftSchema, schedulePostSchema } = require('../sechemas/draftSchema.js');
const { bookmarkPostSchema } = require('../sechemas/bookmarkSchema.js');

const validate = require('../middlewares/validate');

// Search route - should be before /:id route
router.get('/search', validate(searchPostsSchema), postController.searchPosts);

// Draft routes
router.get('/drafts', authenticate, validate(getDraftsSchema), postController.getDraftPosts);
router.post('/:id/publish', authenticate, validate(publishDraftSchema), postController.publishDraft);
router.post('/:id/schedule', authenticate, validate(schedulePostSchema), postController.schedulePost);

router.post('/', authenticate, validate(createPostSchema), postController.createPost);

router.get('/', authenticate, restrictTo('admin'), validate(getAllPostSchema), postController.getAllPosts);

router.get('/:id', authenticate, postController.getPostById);

router.patch('/:id', validate(updatePostSchema), postController.updatePost);

router.delete('/:id', postController.deletePost);

router.post('/:id/view', postController.incrementView);

// POST /posts/:id/images - Upload images to post (post author only, with multer middleware)
// DELETE /posts/:id/images/:imageId - Delete post image (post author only)

router.post('/:id/images', authenticate, postController.uploadPostImages);
router.delete('/:id/images/:imageId', authenticate, postController.deletePostImage);

// Bookmark routes
router.post('/:postId/bookmark', authenticate, validate(bookmarkPostSchema), bookmarksController.bookmarkPost);
router.delete('/:postId/bookmark', authenticate, validate(bookmarkPostSchema), bookmarksController.removeBookmark);

module.exports = router;
