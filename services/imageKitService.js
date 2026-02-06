// Create services/imageKit.js
// Configure ImageKit client
// Functions:
// uploadImage(file, folder, fileName) - Upload image to ImageKit
// deleteImage(fileId) - Delete image from ImageKit
// getImageUrl(fileId, transformations) - Get optimized image URL
// services/imageKit.js
const ImageKit = require('imagekit');
const asyncHandler = require('../utils/asyncHandler');
const path = require('path');
require('dotenv').config();

// Initialize ImageKit
const imageKit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Upload image to ImageKit
const uploadImage = asyncHandler(async (file, folder = '/', fileName) => {
    if (!file) {
        throw new Error('No file provided');
    }

    const uploadResponse = await imageKit.upload({
        file: file.buffer, // Buffer of the file
        fileName: fileName || file.originalname,
        folder: folder
    });

    return uploadResponse;
});

// Delete image from ImageKit
const deleteImage = asyncHandler(async (fileId) => {
    const deleteResponse = await imageKit.deleteFile(fileId);
    return deleteResponse;
});

// Get optimized image URL
const getImageUrl = (filePath, transformations = []) => {
    const url = imageKit.url({
        path: filePath,
        transformation: transformations
    });
    return url;
};

module.exports = {
    imageKit,
    uploadImage,
    deleteImage,
    getImageUrl
};