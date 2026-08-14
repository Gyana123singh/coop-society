const mongoose = require('mongoose');
const config = require('./config');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongoUri, {
      // Options if needed for mongoose v8+
    });
    console.log(`[MongoDB] Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB] Connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
