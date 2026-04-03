import dotenv from "dotenv";
import mongoose from "mongoose"

async function connectDB() {
    try {
         await mongoose.connect(process.env.MONGO_URI) 
         console.log("Database connection successful");
         
    } catch (error) {
        console.log(error + "in Database")
    }
  
}
export default connectDB