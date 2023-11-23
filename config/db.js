import mongoose from "mongoose";
import colors from "colors";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
console.log(`Connected on MongoDb Database ${mongoose.connection.host}` .bgMagenta.white);
} catch (error) {
    console.log(`MongoDB Connection Error ${error}`.bgRed.white);
  }
};


export default connectDb;