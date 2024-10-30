import express from "express";
import cors from "cors";
import connect from "./db.js";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv"
import userRoute from "./routes/userRoute.js"
import workOutRouter from "./routes/workoutRoute.js"
import mealRoute from "./routes/mealRoute.js"
import videoRoute from "./routes/videoRoute.js"
import path from "path"
dotenv.config()

const app=express();
const _dirname=path.resolve()
const corsOptions = {
    origin: 'https://wefit-46dz.onrender.com', // Your frontend URL
    credentials: true, // Allow cookies to be sent
  };
  
  app.use(cors(corsOptions));
  
app.use(express.json());
app.use(cookieParser()); // Add cookie-parser middleware
app.use(express.urlencoded({extended:true}))

app.use('/api/user',userRoute);

app.use('/api/workout',workOutRouter);
app.use('/api/meal',mealRoute);
app.use('/api/video',videoRoute);
app.use(express.static(path.join(_dirname,"/client/build")))
app.get('*',(_,res)=>{
    res.sendFile(path.resolve(_dirname,'client','build','index.html'))
})
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