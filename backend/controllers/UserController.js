const User = require('../models/User'); // Import model User

// Thêm người dùng mới
exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role, studentId, teacherId } = req.body;

        // Tạo một đối tượng người dùng
        const newUser = new User({
            name,
            email,
            password, // Trong thực tế, bạn nên hash password bằng bcrypt
            role,
            studentId,
            teacherId,
        });

        // Lưu người dùng vào database
        await newUser.save();
        res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy danh sách tất cả người dùng
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find(); // Tìm tất cả người dùng
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getStudent = async (req, res) => {
    try {
        // Chỉ lấy người dùng có vai trò là 'student'
        const students = await User.find({ role: 'student' }).select('name email studentId');
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cập nhật thông tin người dùng theo ID
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ URL
        const updates = req.body; // Dữ liệu cần cập nhật

        // Tìm và cập nhật người dùng
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true });

        if (!updatedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Xóa người dùng theo ID
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params; // Lấy ID từ URL

        // Tìm và xóa người dùng
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) return res.status(404).json({ message: 'User not found' });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Đăng nhập
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // So sánh mật khẩu (trong thực tế, hãy mã hóa mật khẩu với bcrypt)
        if (password !== user.password) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Tạo token
        const token = jwt.sign(
            {  id: user._id,
                name: user.name,   
                email: user.email, 
                teacherId: user.teacherId,
                studentId: user.studentId,
                role: user.role },
            process.env.JWT_SECRET, // Sử dụng giá trị từ .env
            { expiresIn: '1h' }
        );

        res.status(200).json({ token, role: user.role });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
