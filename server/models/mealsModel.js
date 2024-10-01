import mongoose from "mongoose";

const mealModel = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    
    mealName: {
        type: String,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true, // e.g., Breakfast, Lunch, Dinner, Snack
        
    },
   
    calories: {
        type: Number,
        required: true
    },
   
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Meal = mongoose.model("Meal", mealModel);

export default Meal;
