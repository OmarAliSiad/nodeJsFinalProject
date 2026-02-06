const imageService = require('../services/imageKitService');
const User = require('../models/userModel');
const asyncHandler = require('../utils/asyncHandler');


// 4.7 Image Optimization
// Use ImageKit transformations for thumbnails, resizing
// Implement lazy loading for frontend
// Add image compression before upload
// Upload profile picture
const uploadProfilePicture = asyncHandler(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }   
    // Compress image
    const compressedFile = await sharp(req.file.buffer)
        .webp({ quality: 50 })
        .toFormat('webp')
        .toBuffer();
    // Upload compressed image to ImageKit
    const uploadResponse = await imageService.uploadImage({ buffer: compressedFile, mimetype: 'image/webp' }, '/profile-pictures');
    // Update user's profilePicture field
    const userId = req.user.id; 
    const user = await User.findByIdAndUpdate(userId, { profilePicture: uploadResponse.url }, { new: true });
    res.status(200).json({ message: 'Profile picture uploaded successfully', profilePicture: user.profilePicture });
}); 

// Delete profile picture
const deleteProfilePicture = asyncHandler(async (req, res) => {
    const userId = req.user.id; 
    const user = await User.findById(userId);
    if (!user || !user.profilePicture) {
        return res.status(404).json({ message: 'Profile picture not found' });
    }   
    // Extract fileId from profilePicture URL
    const fileId = user.profilePicture.split('/').pop();    
    // Delete image from ImageKit   
    await imageService.deleteImage(fileId);
    // Remove profilePicture field from user
    user.profilePicture = undefined;
    await user.save();
    res.status(200).json({ message: 'Profile picture deleted successfully' });
});

const getImageUrl = (fileId, transformations = []) => {
    return imageService.getImageUrl(fileId, transformations);
};

module.exports = {
    uploadProfilePicture,
    deleteProfilePicture,
    getImageUrl
};