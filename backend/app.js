const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

// Đọc file .env
dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('Database connection error:', err));

// Route mặc định
app.get('/', (req, res) => {
  res.send('Hello, this is your backend server!');
});

// Kết nối route
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/quizzes', require('./routes/quizRoutes'));
app.use('/api/results', require('./routes/resultRoutes'));

// Chạy server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));

