
const restrictTo = (allowedRoles) => {
    return (req, res, next) => {
        console.log('User Role:', req.user.role);
        console.log('Allowed Roles:', allowedRoles);
        if (req.user.role === 'user' || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: ou do not have permission to access this resource.' });
        }
        next();
    };
}

module.exports = restrictTo;