import app from "./src/app.js";
import dotenv from "dotenv";
dotenv.config()
import connectDB from "./src/database/db.js"

connectDB()

app.listen(3000,()=>{
    console.log("Server Started Successfully");
    
})