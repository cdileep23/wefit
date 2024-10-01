import mongoose from "mongoose";

const workoutModel=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    category:{
        type:String,
        required:true
    },
    workoutName:{
        type:String,
        required:true,
       

    },
    sets:{
        type:Number,
        
    },
    weight:{
        type:Number,
    },
    duration:{
        type:Number,
    },
    caloriesBurned:{
        type:Number
    },
    date:{
        type:Date,
        default:Date.now
    }

},{timestamps:true})

const WorkOut=mongoose.model("WorkOut",workoutModel);

export default WorkOut