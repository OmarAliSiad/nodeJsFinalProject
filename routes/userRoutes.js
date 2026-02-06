const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const bookmarksController = require('../controllers/bookmarksController');
const {
  getAllUserSchema, updateUserSchema,
  signUpSchema, signInSchema, vaildatePasswordResetSchema
} = require('../sechemas/userSchema');
const { searchUsersSchema } = require('../sechemas/searchSchema');
const validate = require('../middlewares/validate');
const authenticate = require('../middlewares/authMiddleware');
const restrictTo = require('../middlewares/restrictTo');
const imageController = require('../controllers/imageController');
const { authRateLimiter, passwordResetRateLimiter, fileUploadRateLimiter } = require('../middlewares/rateLimiterMiddler');

// Search route - should be before /:id route
router.get('/search', validate(searchUsersSchema), userController.searchUsers);

// Bookmarks route
router.get('/bookmarks', authenticate, bookmarksController.getUserBookmarks);

router.post('/sign-up', authRateLimiter, validate(signUpSchema), userController.singUp);

router.post('/sign-in', authRateLimiter, validate(signInSchema), userController.singIn);

router.post('/reset-password', passwordResetRateLimiter, validate(vaildatePasswordResetSchema), userController.resetPassword);
router.get('/', authenticate, restrictTo(['admin']), validate(getAllUserSchema), userController.getAllUsers);

router.get('/:id', userController.getUserById);

router.patch('/:id', validate(updateUserSchema), userController.updateUser);

router.delete('/:id', userController.deleteUser);

//POST /users/profile-picture - Upload profile picture (authenticated, with multer middleware)
// DELETE /users/profile-picture - Delete profile picture (authenticated)
//getImageUrl(fileId, transformations) - Get optimized image URL

router.post('/profile-picture', fileUploadRateLimiter, authenticate, imageController.uploadProfilePicture);
router.delete('/profile-picture', authenticate, imageController.deleteProfilePicture);

module.exports = router;