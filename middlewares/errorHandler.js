const AppError = require('../utils/AppError');
const errorHandler = (err, req, res, next) => {
    console.error("❌❌ Error:", err.stack);

    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ message: err.message, success: false, isClientError: err.isClientError })
    }

    // mongoose errors
    if (err.name === "CastError") {
        return res.status(400).json({ message: "Invalid id format", success: false, isClientError: true })
    }
    if (err.code === 11000 && err.name === "MongoServerError") {
        return res.status(400).json({ message: `resource already exists ${Object.keys(err.keyValue)[0]} : ${err.keyValue[Object.keys(err.keyValue)[0]]}`, success: false, isClientError: true })
    }
    if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message, success: false, isClientError: true })
    }

    // تحديد status code
    const statusCode = err.statusCode || 500;
    // إرسال response كـ JSON
    res.status(statusCode).json({
        success: false,
        message: err.message || 'Internal Server Error',
        // لا ترسل الـ stack في production
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        //process.env.NODE_ENV === 'development' // true or false
        // ...(true && { stack: err.stack })
        //...( {stack: err.stack })
        //{stack: err.stack }
        // });
    });
}

module.exports = errorHandler;


