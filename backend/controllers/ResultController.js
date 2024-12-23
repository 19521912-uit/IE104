const Result = require('../models/Result');
const Quiz = require('../models/Quiz');
const User = require('../models/User'); 

// Lưu kết quả làm bài kiểm tra
exports.saveResult = async (req, res) => {
  try {
    const { quizId, studentId, answers } = req.body;

    if (!quizId || !studentId || !answers) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    // Tính toán điểm và bổ sung `isCorrect` cho mỗi câu trả lời
    const totalQuestions = quiz.questions.length;
    const pointsPerQuestion = 10 / totalQuestions;

    let score = 0;
    const updatedAnswers = answers.map((answer) => {
      const question = quiz.questions.find(
        (q) => q._id.toString() === answer.questionId
      );

      const isCorrect = question && question.correctAnswer === answer.selectedAnswer; // So sánh với nội dung đáp án
      if (isCorrect) {
        score += pointsPerQuestion;
      }

      return {
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect, // Thêm trường isCorrect
      };
    });

    const result = new Result({
      quizId,
      studentId,
      score,
      answers: updatedAnswers, // Sử dụng danh sách answers đã cập nhật
    });

    await result.save();
    res.status(201).json({ message: 'Result saved successfully', score });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// Lấy kết quả bài kiểm tra của một sinh viên
exports.getResultsByStudent = async (req, res) => {
    try {
        console.log('Student ID in API:', req.user.id);
        const { studentId } = req.user.id;
        const results = await Result.find({ studentId }).populate('quizId');
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy danh sách trạng thái làm bài kiểm tra của sinh viên
exports.getQuizResultsByQuiz = async (req, res) => {
  try {
      const { quizId } = req.params;

      // Lấy thông tin bài kiểm tra
      const quiz = await Quiz.findById(quizId).populate('students', 'name email');
      if (!quiz) {
          return res.status(404).json({ message: "Quiz not found" });
      }

      // Tìm kết quả làm bài của từng sinh viên trong danh sách
      const results = await Result.find({ quizId });
      const resultMap = new Map();

      results.forEach(result => {
          resultMap.set(result.studentId.toString(), result.score);
      });

      // Tạo danh sách sinh viên với trạng thái
      const studentsStatus = quiz.students.map(student => ({
          studentId: student._id,
          name: student.name,
          email: student.email,
          status: resultMap.has(student._id.toString()) 
              ? `Completed - Score: ${resultMap.get(student._id.toString())}` 
              : 'Not Completed'
      }));

      res.status(200).json({ quizTitle: quiz.title, studentsStatus });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching quiz results', error: error.message });
  }
};

exports.getCompletedQuizzes = async (req, res) => {
    try {
      const { studentId } = req.params; // Lấy studentId từ URL params
  
      // Tìm tất cả kết quả bài kiểm tra của sinh viên
      const results = await Result.find({ studentId }).populate('quizId', 'title'); // Lấy thông tin quiz (chỉ lấy title)
  
      // Tạo danh sách trả về với thông tin bài kiểm tra và điểm số
      const completedQuizzes = results.map((result) => ({
        quizTitle: result.quizId.title,
        score: result.score,
      }));
  
      res.status(200).json(completedQuizzes);
    } catch (error) {
      console.error('Error fetching completed quizzes:', error);
      res.status(500).json({ error: 'Failed to fetch completed quizzes' });
    }
  };