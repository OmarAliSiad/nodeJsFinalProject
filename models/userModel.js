const mongoose = require("mongoose");
//schema
//User Model: Add profilePicture field (String - URL) 

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    age: { type: String, required: true },
    profilePicture: { type: String } // New field for profile picture URL
}, { timestamps: true })

//Add indexes to:
// User model: email (already exists), name
userSchema.index({ email: 1 });
userSchema.index({ name: 1 });
// Text index for full-text search on name and email
userSchema.index({ name: 'text', email: 'text' });
//model 
const User = new mongoose.model('User', userSchema);

module.exports = User;