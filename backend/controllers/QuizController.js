const Quiz = require('../models/Quiz');

const mongoose = require('mongoose');
const User = require('../models/User'); // Model User cần đúng

exports.createQuiz = async (req, res) => {
  try {
    const { title, questions, students } = req.body;
    const teacherId = req.user.id;

    // Lấy danh sách sinh viên dựa trên _id
    const studentDetails = await User.find({ _id: { $in: students } }).select('studentID');

    // Nếu cần lưu studentID thay vì _id
    const studentIDs = studentDetails.map((student) => student.studentID);

    const newQuiz = new Quiz({
      title,
      teacherId,
      questions,
      students, // Lưu _id nếu muốn, hoặc studentIDs nếu cần
    });

    await newQuiz.save();

    res.status(201).json({ message: 'Quiz created successfully!', quiz: newQuiz });
  } catch (error) {
    console.error('Error creating quiz:', error);
    res.status(500).json({ message: 'Failed to create quiz. Please try again.', error: error.message });
  }
};



// Lấy danh sách bài kiểm tra
exports.getQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('teacherId').populate('students');
        res.status(200).json(quizzes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

 const Result = require('../models/Result');

exports.getUnattemptedQuizzes = async (req, res) => {
     try {
         const studentId = req.user.id;
         console.log('Student ID:', studentId);
         // Lấy tất cả bài kiểm tra mà sinh viên chưa làm
         const quizzes = await Quiz.find({ students: studentId });
         console.log('Quizzes:', quizzes);
         const results = await Result.find({ studentId });
         console.log('Results:', results);
         // Lọc các bài kiểm tra đã làm
         const unattemptedQuizzes = quizzes.filter(quiz => 
             !results.some(result => result.quizId.toString() === quiz._id.toString())
         );

         res.status(200).json(unattemptedQuizzes);
     } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Failed to fetch quizzes' });
     }
};

// Lấy danh sách bài kiểm tra chưa làm của một sinh viên
exports.getQuizzesNotTakenByStudent = async (req, res) => {
  try {
    const { studentId } = req.params; // Lấy studentId từ URL params

    // Lấy danh sách tất cả bài kiểm tra
    const allQuizzes = await Quiz.find();

    // Lấy danh sách quizId mà sinh viên đã làm
    const completedQuizIds = await Result.find({ studentId }).distinct('quizId');

    // Lọc danh sách bài kiểm tra chưa làm
    const uncompletedQuizzes = allQuizzes.filter(
      (quiz) => !completedQuizIds.includes(quiz._id.toString())
    );

    res.status(200).json(uncompletedQuizzes);
  } catch (error) {
    console.error('Error fetching uncompleted quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch uncompleted quizzes' });
  }
};