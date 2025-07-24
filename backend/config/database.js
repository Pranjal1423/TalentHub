const mongoose = require('mongoose');

// This function connects our app to MongoDB
const connectDatabase = async () => {
  try {
    // mongoose.connect() establishes connection to MongoDB
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,    // Prevents deprecation warnings
      useUnifiedTopology: true, // Uses new connection management engine
    });
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1); // Exit the app if database fails
  }
};

module.exports = connectDatabase;