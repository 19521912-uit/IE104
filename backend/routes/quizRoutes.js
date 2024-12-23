const express = require('express');
const router = express.Router();
const QuizController = require('../controllers/QuizController');
const Quiz = require('../models/Quiz');
const { auth, authorize } = require('../middlewares/auth');

// Route tạo bài kiểm tra (chỉ giáo viên được phép)
router.post('/create', auth, authorize(['teacher']), QuizController.createQuiz);

// Route lấy danh sách bài kiểm tra (ai cũng có thể)
router.get('/', auth, QuizController.getQuizzes);

// Route lấy danh sách bài kiểm tra chưa làm
router.get('/student/quizzes', auth, authorize(['student']), QuizController.getUnattemptedQuizzes);

router.get('/teacher', auth, authorize(['teacher']), async (req, res) => {
    try {
      const teacherId = req.user.id; // Lấy teacherId từ query params
      console.log('Teacher ID:', teacherId);
      
      // Tìm các bài kiểm tra dựa trên teacherId
      const quizzes = await Quiz.find({ teacherId: teacherId });
      res.json(quizzes);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      res.status(500).json({ error: error.message });
    }
  });

// Route: Lấy danh sách bài kiểm tra chưa làm của một sinh viên
router.get('/not-taken/:studentId', auth, authorize(['student']), QuizController.getQuizzesNotTakenByStudent);

router.get('/:quizId', async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId).populate('questions');
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.json(quiz);
  } catch (error) {
    console.error('Error fetching quiz:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
