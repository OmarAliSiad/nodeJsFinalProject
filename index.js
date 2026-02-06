const mongoose = require('mongoose');
const express = require("express");
const app = express();

// Middleware to parse request bodies with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


const postRoutes = require('./routes/postRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
// Export schemas in schemas/comments/index.js
const commentRoutes = require('./routes/comments.js');
const likeRoutes = require('./routes/likeRoutes.js');
const followRoutes = require('./routes/followRoutes.js');
const notificationRoutes = require('./routes/notificationRoutes.js');
const dotenv = require('dotenv');
dotenv.config(); //enable env variables
const errorHandler = require('./middlewares/errorHandler.js');

app.use('/comments', commentRoutes);
app.use('/posts', postRoutes);
app.use('/users', userRoutes);
//Register router in index.js
app.use('/likes', likeRoutes);
app.use('/follows', followRoutes);
app.use('/notifications', notificationRoutes);
app.use(errorHandler);

const PORT = Number(process.env.PORT);

app.listen(PORT, async () => {
    await mongoose.connect(`mongodb://localhost:27017/${process.env.DB_NAME}`).then(() => {
        console.log('✅✅ Connected to MongoDB');
    }).catch((err) => {
        console.log('❌❌ failed Conntected to MongoDB');
        console.log(err);
    });
    console.log(`✅✅ Server is running on Port:${PORT}`);
});
