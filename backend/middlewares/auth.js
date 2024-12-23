const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Authorization header missing or malformed' });
    }

    const token = authHeader.split(' ')[1]; // Lấy token từ header

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
        req.user = verified; // Thêm thông tin user vào request
        next(); // Cho phép tiếp tục
    } catch (err) {
        console.error(err); // Log lỗi
        return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
    }
};

// Middleware kiểm tra quyền
const authorize = (roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
};

module.exports = { auth, authorize };
