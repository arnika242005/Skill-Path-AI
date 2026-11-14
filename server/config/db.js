const mongoose = require("mongoose");

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    console.log("No MONGO_URI provided; running without MongoDB.");
    return;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn("MongoDB Connection Warning (non-fatal):", error.message);
  }
};

module.exports = connectDB;