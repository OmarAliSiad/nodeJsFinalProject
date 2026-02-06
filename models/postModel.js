/*
2.6 Update Post & Comment Models
Add virtual field or method to get likes count
Optionally add likedBy array for quick access (consider performance)
*/
//Post Model: Add images array field (Array of Strings - URLs)
mongoose = require('mongoose');
const postSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, required: true },
    userId: { type: String },
    tags: { type: [String], default: [] },
    published: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
    likedBy: { type: [String], default: [] },
    images: { type: [String], default: [] }, // New field for post image URLs
    status: { type: String, enum: ['draft', 'published', 'scheduled'], default: 'draft' },
    publishedAt: { type: Date },
    views: { type: Number, default: 0 },
}, { timestamps: true });

//Post model: user, status, createdAt, title (for search)
postSchema.index({ userId: 1 });
postSchema.index({ published: 1 });
postSchema.index({ createdAt: 1 });
// Text index for full-text search on title and content
postSchema.index({ title: 'text', content: 'text' });
//model
const Posts = new mongoose.model('Posts', postSchema);

module.exports = Posts;