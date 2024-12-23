const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên người dùng
    email: { type: String, required: true, unique: true }, // Email (định danh)
    password: { type: String, required: true }, // Mật khẩu (sẽ được mã hóa)
    role: { type: String, enum: ['student', 'teacher'], required: true }, // Vai trò: sinh viên hoặc giáo viên
    studentId: { type: String }, // Chỉ dùng nếu người dùng là sinh viên
    teacherId: { type: String }, // Chỉ dùng nếu người dùng là giáo viên
}, { timestamps: true }); // timestamps sẽ tự động thêm createdAt và updatedAt

module.exports = mongoose.model('User', userSchema);
