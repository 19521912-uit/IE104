const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const { auth, authorize } = require('../middlewares/auth');

// API thêm người dùng mới
router.post('/register', UserController.createUser);

// API lấy danh sách người dùng
router.get('/', UserController.getUsers);

// API cập nhật người dùng
router.put('/:id', UserController.updateUser);

// API xóa người dùng
router.delete('/:id', UserController.deleteUser);

// API đăng nhập
router.post('/login', UserController.login);

router.get('/students', UserController.getStudent);


module.exports = router;
