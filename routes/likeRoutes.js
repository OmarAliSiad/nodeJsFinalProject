/*
Create routers/likes.js
Endpoints:
POST /likes - Toggle like on post or comment (authenticated)
GET /likes/count - Get likes count (query: targetType, targetId)
GET /likes/check - Check if user liked (query: targetType, targetId)
GET /users/:userId/likes - Get all likes by a user
*/

const express = require('express');
const likeController = require('../controllers/likeController.js');
const validate = require('../middlewares/validate.js');
const authenticate = require('../middlewares/authMiddleware.js');
const {
    toggleLikeSchema,
    getLikesCountSchema,
    isLikedByUserSchema,
    getUserLikesSchema
} = require('../sechemas/likesSchema.js');
const router = express.Router();

router.post('/', authenticate, validate(toggleLikeSchema), likeController.toggleLike);
router.get('/count', authenticate, validate(getLikesCountSchema), likeController.getLikesCount);
router.get('/check', authenticate, validate(isLikedByUserSchema), likeController.isLikedByUser);
router.get('/users/likes', authenticate, validate(getUserLikesSchema), likeController.getUserLikes);

module.exports = router;