const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authenticate = require('../middlewares/authMiddleware');
const validate = require('../middlewares/validate');
const { followUserSchema, getFollowsSchema } = require('../sechemas/followSchema');

// Follow a user
router.post('/:userId/follow', authenticate, validate(followUserSchema), followController.followUser);

// Unfollow a user
router.delete('/:userId/follow', authenticate, validate(followUserSchema), followController.unfollowUser);

// Get user's followers
router.get('/:userId/followers', validate(getFollowsSchema), followController.getFollowers);

// Get users being followed
router.get('/:userId/following', validate(getFollowsSchema), followController.getFollowing);

// Get follow counts
router.get('/:userId/follow-counts', validate(followUserSchema), followController.getFollowCounts);

module.exports = router;
