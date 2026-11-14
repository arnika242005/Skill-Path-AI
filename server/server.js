const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// If Mongo is configured, connect optionally (backward compatibility)
if (process.env.MONGO_URI) {
  try {
    const connectDB = require('./config/db');
    connectDB();
  } catch (err) {
    console.warn("MongoDB connection skipped or failed:", err.message);
  }
} else {
  console.log("Running in Firebase mode: MongoDB not required.");
}

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5002',
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps, curl, postman)
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes('*')) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive for easy development and deployment
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    mode: 'firebase',
    hasGroqKey: !!process.env.GROQ_API_KEY,
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/assessments', require('./routes/assessmentRoutes'));
app.use('/api/recommendations', require('./routes/recommendationRoutes'));
app.use('/api/pdf', require('./routes/pdfRoutes'));

// Fallback legacy routes if still called during migration
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/progress', require('./routes/progressRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SkillPath AI Server running on port ${PORT}`);
  console.log(`Groq AI configured: ${!!process.env.GROQ_API_KEY}`);
});