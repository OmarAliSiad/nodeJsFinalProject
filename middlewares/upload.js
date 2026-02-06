/*
Create middlewares/upload.js
Configure multer for:
Profile pictures (single file, max 2MB, jpg/png only)
Post images (multiple files, max 5MB each, jpg/png/webp)
Add file validation (size, type)
*/

const multer = require('multer');
const path = require('path');

// Multer storage configuration (in-memory storage)
const storage = multer.memoryStorage();

// File filter for validating file types
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only jpg, png, and webp are allowed.'), false);
    }
}

// Multer instance for profile picture upload
const profilePicUpload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
    fileFilter
}).single('profilePic');

// Multer instance for post images upload
const postImagesUpload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit per file
    fileFilter
}).array('postImages', 10); // Max 10 images

module.exports = {
    profilePicUpload,
    postImagesUpload
};
