import express from "express";
import cors from "cors";
import connect from "./db.js";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv"
import userRoute from "./routes/userRoute.js"
import workOutRouter from "./routes/workoutRoute.js"
import mealRoute from "./routes/mealRoute.js"
import videoRoute from "./routes/videoRoute.js"
dotenv.config()

const app=express();

const corsOptions = {
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true, // Allow cookies to be sent
  };
  
  app.use(cors(corsOptions));
  
app.use(express.json());
app.use(cookieParser()); // Add cookie-parser middleware
app.use(express.urlencoded({extended:true}))
app.get("/",async(req,res)=>{
    res.status(200).json({
        message:"hello from vercel"
    })
})
app.use('/api/user',userRoute);

app.use('/api/workout',workOutRouter);
app.use('/api/meal',mealRoute);
app.use('/api/video',videoRoute);
const startServer=async()=>{
    try {
        connect()
        app.listen(process.env.PORT|| 9000, ()=>{
            console.log(`Server running at port ${process.env.PORT}`);
        })
    } catch (error) {
       console.log(error);  
    }
}

startServer();