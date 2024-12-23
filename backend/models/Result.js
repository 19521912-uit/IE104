const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true }, // Bài kiểm tra
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true }, // Sinh viên làm bài kiểm tra
    score: { type: Number, required: true }, // Điểm số
    answers: [
        {
            questionId: { type: String, required: true }, // ID của câu hỏi
            selectedAnswer: { type: String, required: true }, // Đáp án mà sinh viên chọn
            isCorrect: { type: Boolean, required: true }, // Đúng/sai
        }
    ],
}, { timestamps: true });

module.exports = mongoose.model('Result', resultSchema);
