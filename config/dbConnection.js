import mongoose from "mongoose";
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1:27017/miniproject");

const connectToDB = async () => {
    try {
      const { connection } = await mongoose.connect(
        `mongodb://127.0.0.1:27017/miniProject`
      );
  
      if (connection) {
        console.log(`Connected to MongoDB: ${connection.host}`);
      }
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  export default connectToDB;

