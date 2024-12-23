const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Tiêu đề bài kiểm tra
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Giáo viên tạo bài kiểm tra
    questions: [
        {
            question: { type: String, required: true }, // Nội dung câu hỏi
            options: [{ type: String, required: true }], // Các đáp án
            correctAnswer: { type: String, required: true }, // Đáp án đúng
        }
    ],
    students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Danh sách sinh viên được thêm vào bài kiểm tra
}, { timestamps: true });

module.exports = mongoose.model('Quiz', quizSchema);
