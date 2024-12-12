import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("Connect to mongodb successfully");
  } catch (error) {
    console.log(`ERROR : ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;