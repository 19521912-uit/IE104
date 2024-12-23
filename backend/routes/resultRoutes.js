const express = require('express');
const router = express.Router();
const ResultController = require('../controllers/ResultController');
const { auth, authorize } = require('../middlewares/auth');

router.post('/save', auth, authorize(['student']), ResultController.saveResult);
router.get('/:studentId', auth, authorize(['teacher']), ResultController.getResultsByStudent);

router.get('/quiz/:quizId/results', auth, authorize(['teacher']), ResultController.getQuizResultsByQuiz);

// Route: Lấy danh sách bài kiểm tra đã làm
router.get('/completed-quizzes/:studentId', auth, ResultController.getCompletedQuizzes);

module.exports = router;
