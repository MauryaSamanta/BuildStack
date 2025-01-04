import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // MongoDB URI including the database name
    const dbUri = process.env.MONGO_URI;

    // Connecting to MongoDB
    await mongoose.connect(dbUri);

    console.log(`MongoDB connected successfully to database: ${process.env.MONGO_URI ? 'Remote Database' : 'Local Database'}`);
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);  // Exit the process with a failure code if connection fails
  }
};

export default connectDB;
