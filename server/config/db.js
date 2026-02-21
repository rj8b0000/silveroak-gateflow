import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    console.log(`Connecting to MongoDB... ${process.env.MONGO_URI ? process.env.MONGO_URI.substring(0, 20) : 'NO URI FOUND'}...`);
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
