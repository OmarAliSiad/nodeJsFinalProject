// 1.4 Comment Routes
// Create routers/comments.js
// Endpoints:
// POST /comments - Create comment (authenticated)
// GET /comments - Get all comments (with optional postId filter)
// GET /comments/:id - Get comment by ID
// PATCH /comments/:id - Update comment (author only)
// DELETE /comments/:id - Delete comment (author or post author)
// GET /posts/:postId/comments - Get comments for a specific post

const express = require('express');
const commentController = require('../controllers/commentsController.js');
const authenticate = require('../middlewares/authMiddleware.js');
const { createCommentSchema, getCommentsSchema, updateCommentSchema } = require('../sechemas/commentsSchema.js');
const validate = require('../middlewares/validate.js');
const router = express.Router();

router.post('/', authenticate, validate(createCommentSchema), commentController.createComment);
router.get('/', authenticate, validate(getCommentsSchema), commentController.getAllComments);
router.get('/:id', authenticate, commentController.getCommentById);
router.patch('/:id', authenticate, validate(updateCommentSchema), commentController.updateCommentById);
router.delete('/:id', authenticate, commentController.deleteCommentById);
// GET /posts/:postId/comments - Get comments for a specific post
router.get('/:id', authenticate, commentController.getCommentsByPost);


module.exports = router;
