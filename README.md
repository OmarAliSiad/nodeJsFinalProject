# Blog Server - Production-Ready REST API

A comprehensive, production-ready blog server built with Node.js, Express, and MongoDB. This project demonstrates advanced Node.js skills including authentication, file uploads, email integration, real-time notifications, and more.

## 🚀 Features

### Core Features
- ✅ **User Authentication & Authorization** - JWT-based auth with role management
- ✅ **Blog Posts Management** - CRUD operations with drafts, scheduling, and views tracking
- ✅ **Comments System** - Nested comments with replies
- ✅ **Likes/Reactions** - Like posts and comments
- ✅ **User Follow System** - Follow/unfollow users
- ✅ **Bookmarks** - Save posts for later reading
- ✅ **Notifications** - In-app notifications for interactions
- ✅ **Search Functionality** - Full-text search for posts and users
- ✅ **File Upload** - Profile pictures and post images with ImageKit
- ✅ **Email Integration** - Welcome emails, password reset, notifications
- ✅ **Password Reset Flow** - Secure password recovery

### Advanced Features
- ✅ **Rate Limiting** - Protection against abuse
- ✅ **Logging** - Structured logging with Winston
- ✅ **Error Handling** - Centralized error management
- ✅ **Input Validation** - Joi schema validation
- ✅ **Database Indexing** - Optimized queries
- ✅ **Docker Support** - Easy deployment with Docker Compose

## 📋 Table of Contents
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)

---

##  Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v5 or higher)
- npm or yarn package manager
- ImageKit account (for image uploads)
- Gmail account (for email functionality)

### Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd finalProject
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Fill in all required environment variables (see [Environment Variables](#environment-variables))

4. **Set up MongoDB**
   - Ensure MongoDB is running locally on port 27017
   - Or update the connection string in `index.js` for remote MongoDB

5. **Set up ImageKit**
   - Create an account at [ImageKit.io](https://imagekit.io/)
   - Get your API keys and URL endpoint
   - Add them to `.env`

6. **Set up Gmail for emails**
   - Enable 2-factor authentication on your Gmail account
   - Generate an App Password
   - Add credentials to `.env`

---

##  Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000

# Database Configuration
DB_NAME=blog_db

# JWT Configuration
JWT_SECRET=your_super_secure_jwt_secret_key

# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-gmail-app-password
EMAIL_FROM=noreply@yourblog.com

# ImageKit Configuration
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_imagekit_id

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Optional
NODE_ENV=development
```

### Getting Gmail App Password
1. Go to your Google Account settings
2. Enable 2-Factor Authentication
3. Go to Security → App Passwords
4. Generate a new app password for "Mail"
5. Use this password in `SMTP_PASS`

### Getting ImageKit Credentials
1. Sign up at [ImageKit.io](https://imagekit.io/)
2. Go to Dashboard → Developer Options
3. Copy Public Key, Private Key, and URL Endpoint

---

##  Running the Application

### Development Mode
```bash
npm run dev
```
The server will start on `http://localhost:3000` (or your configured PORT) with hot-reloading enabled.

### Production Mode
```bash
npm start
```

### Using Docker
```bash
# Build and start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f
```

---

##  API Documentation

### Base URL
```
http://localhost:3000
```

### Authentication
Most endpoints require authentication. Include JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### API Endpoints Overview

#### 🔐 Authentication
- `POST /users/sign-up` - Register new user
- `POST /users/sign-in` - Login user
- `POST /users/forgot-password` - Request password reset
- `POST /users/reset-password` - Reset password with token
- `PATCH /users/change-password` - Change password (authenticated)

#### 👤 Users
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `GET /users/search?q=<query>` - Search users
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user
- `POST /users/profile-picture` - Upload profile picture
- `DELETE /users/profile-picture` - Delete profile picture
- `GET /users/bookmarks` - Get user's bookmarks

#### 📝 Posts
- `POST /posts` - Create post
- `GET /posts` - Get all posts (admin only)
- `GET /posts/:id` - Get post by ID
- `GET /posts/search?q=<query>` - Search posts
- `GET /posts/drafts` - Get user's drafts
- `POST /posts/:id/publish` - Publish draft
- `POST /posts/:id/schedule` - Schedule post
- `PATCH /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post
- `POST /posts/:id/view` - Increment view count
- `POST /posts/:id/images` - Upload post images
- `DELETE /posts/:id/images/:imageId` - Delete post image
- `POST /posts/:postId/bookmark` - Bookmark post
- `DELETE /posts/:postId/bookmark` - Remove bookmark

#### 💬 Comments
- `POST /comments` - Create comment
- `GET /comments` - Get all comments
- `GET /comments/:id` - Get comment by ID
- `GET /posts/:postId/comments` - Get post comments
- `PATCH /comments/:id` - Update comment
- `DELETE /comments/:id` - Delete comment

#### ❤️ Likes
- `POST /likes` - Toggle like (post/comment)
- `GET /likes/count?targetType=<Post|Comment>&targetId=<id>` - Get likes count
- `GET /likes/check?targetType=<Post|Comment>&targetId=<id>` - Check if liked
- `GET /users/:userId/likes` - Get user's likes

#### 👥 Follows
- `POST /follows/:userId/follow` - Follow user
- `DELETE /follows/:userId/follow` - Unfollow user
- `GET /follows/:userId/followers` - Get user's followers
- `GET /follows/:userId/following` - Get users following
- `GET /follows/:userId/follow-counts` - Get follower/following counts

#### 🔔 Notifications
- `GET /notifications` - Get user's notifications
- `PATCH /notifications/:id/read` - Mark as read
- `PATCH /notifications/read-all` - Mark all as read
- `DELETE /notifications/:id` - Delete notification

### Detailed API Examples

For detailed API documentation with request/response examples, see [BLOG_FEATURES_IMPLEMENTATION.md](./BLOG_FEATURES_IMPLEMENTATION.md)

---

## 📁 Project Structure

```
finalProject/
├── config/
│   └── logger.js                 # Winston logger configuration
├── controllers/
│   ├── bookmarksController.js    # Bookmark operations
│   ├── commentsController.js     # Comment CRUD
│   ├── followController.js       # Follow/unfollow logic
│   ├── imageController.js        # Image upload handling
│   ├── likeController.js         # Like/unlike operations
│   ├── notificationsController.js # Notification management
│   ├── postController.js         # Post CRUD and operations
│   └── userController.js         # User management
├── middlewares/
│   ├── authMiddleware.js         # JWT authentication
│   ├── errorHandler.js           # Global error handling
│   ├── rateLimiterMiddler.js     # Rate limiting
│   ├── restrictTo.js             # Role-based access control
│   ├── upload.js                 # Multer file upload config
│   └── validate.js               # Joi validation middleware
├── models/
│   ├── bookmarkModel.js          # Bookmark schema
│   ├── commentModel.js           # Comment schema
│   ├── followModel.js            # Follow relationship schema
│   ├── likesModel.js             # Like schema
│   ├── notificationModel.js      # Notification schema
│   ├── postModel.js              # Post schema
│   └── userModel.js              # User schema
├── routes/
│   ├── comments.js               # Comment routes
│   ├── followRoutes.js           # Follow routes
│   ├── likeRoutes.js             # Like routes
│   ├── notificationRoutes.js     # Notification routes
│   ├── postRoutes.js             # Post routes
│   └── userRoutes.js             # User routes
├── sechemas/                     # Joi validation schemas
│   ├── bookmarkSchema.js
│   ├── commentsSchema.js
│   ├── draftSchema.js
│   ├── followSchema.js
│   ├── likesSchema.js
│   ├── notificationSchema.js
│   ├── postSchema.js
│   ├── searchSchema.js
│   └── userSchema.js
├── services/
│   ├── bookmarksSrivces.js       # Bookmark business logic
│   ├── commentService.js         # Comment business logic
│   ├── email_services.js         # Email sending logic
│   ├── followService.js          # Follow business logic
│   ├── imageKitService.js        # ImageKit integration
│   ├── likeService.js            # Like business logic
│   ├── notificationService.js    # Notification logic
│   ├── post.service.js           # Post business logic
│   └── user.service.js           # User business logic
├── templates/
│   └── emails/                   # HTML email templates
│       ├── commentNotification.html
│       ├── passwordReset.html
│       ├── passwordResetConfirmation.html
│       ├── replyNotification.html
│       └── welcome.html
├── utils/
│   ├── AppError.js               # Custom error class
│   └── asyncHandler.js           # Async error wrapper
├── .dockerignore
├── .env                          # Environment variables (not in git)
├── .env.example                  # Environment variables template
├── .gitignore
├── docker-compose.yml            # Docker configuration
├── index.js                      # Application entry point
├── package.json                  # Dependencies and scripts
└── README.md                     # This file
```

---

## Technologies Used

### Core
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM

### Authentication & Security
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **express-rate-limit** - Rate limiting

### File Upload
- **Multer** - File upload middleware
- **ImageKit** - Image CDN and optimization

### Email
- **Nodemailer** - Email sending

### Validation & Logging
- **Joi** - Schema validation
- **Winston** - Logging
- **Morgan** - HTTP request logging

### Development
- **nodemon** - Development server with hot reload
- **dotenv** - Environment variable management

---

## 🗄️ Database Schema

### Collections
- **users** - User accounts and profiles
- **posts** - Blog posts
- **comments** - Post comments (nested)
- **likes** - Likes on posts and comments
- **follows** - User follow relationships
- **bookmarks** - User bookmarks
- **notifications** - User notifications

### Indexes
All collections have appropriate indexes for optimal query performance:
- Text indexes on searchable fields
- Compound indexes on frequently queried combinations
- Unique indexes on user relationships

---

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ Password hashing with bcrypt
- ✅ Rate limiting per endpoint
- ✅ Input validation with Joi
- ✅ Request size limits
- ✅ Secure password reset flow
- ✅ Role-based access control
- ✅ Error handling without stack trace leaks

---

## 📊 Rate Limits

- **Authentication endpoints**: 5 requests per 15 minutes
- **Password reset**: 3 requests per hour
- **File uploads**: 10 requests per hour
- **General API**: 100 requests per 15 minutes

---

## 🐛 Error Handling

The application uses centralized error handling with custom error classes. All errors are logged and returned in a consistent format:

```json
{
  "error": "Error message",
  "details": ["Detailed error information"]
}
```

---

## 📝 Logging

Logs are stored in the `logs/` directory:
- `error.log` - Error level logs
- `combined.log` - All logs

Logs include timestamps, request IDs, and structured data.

---

## 🚢 Deployment

### Using Docker

1. **Build and start**:
   ```bash
   docker-compose up -d
   ```

2. **View logs**:
   ```bash
   docker-compose logs -f
   ```

3. **Stop**:
   ```bash
   docker-compose down
   ```

### Manual Deployment

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start index.js --name blog-server
   ```

### Environment Checklist
- [ ] Set secure `JWT_SECRET`
- [ ] Configure production MongoDB URL
- [ ] Set up production email credentials
- [ ] Configure ImageKit for production
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS in production
- [ ] Set up reverse proxy (nginx)
- [ ] Configure firewall rules

---

## 🧪 Testing

### Manual Testing
Use tools like Postman or Thunder Client to test endpoints. Import the provided Postman collection (if available).

### Example Test Flow
1. Sign up a new user
2. Sign in to get JWT token
3. Create a post (draft)
4. Publish the post
5. Add comments
6. Like the post
7. Follow other users
8. Check notifications

---

##  Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Follow existing code style
- Add comments for complex logic
- Update documentation for new features

---

## 📄 License

This project is part of the Node.js course final project.

---

## 👥 Authors

Created as a final project for the Node.js course.

---

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Check existing documentation
- Review the API documentation

---

## 🎓 Learning Resources

This project demonstrates:
- RESTful API design
- MVC architecture pattern
- JWT authentication
- File upload handling
- Email integration
- Database optimization
- Error handling patterns
- Security best practices

---

## 🙏 Acknowledgments

- Node.js course instructors
- Express.js documentation
- MongoDB documentation
- Community contributions

---

## 📈 Future Enhancements

Potential improvements:
- [ ] Real-time notifications with Socket.io
- [ ] GraphQL API
- [ ] Redis caching
- [ ] Elasticsearch for advanced search
- [ ] API versioning
- [ ] Comprehensive test suite
- [ ] API documentation with Swagger
- [ ] WebSocket support for chat

---

**Happy Coding! 🚀**
