const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));
app.use('/api/pdf', require('./routes/pdfRoutes'));

const PORT = process.env.PORT || 5000;

console.log("PORT from env:", process.env.PORT);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));