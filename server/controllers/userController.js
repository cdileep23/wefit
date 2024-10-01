import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookie from "cookie"
import User from "../models/userModel.js";
import WorkOut from "../models/workoutModel.js";
import Meal from "../models/mealsModel.js"

dotenv.config();
export const register = async (req, res) => {
  try {
    const { name, email, password, age, weight, height } = req.body;
    if (!name || !email || !password || !age || !weight || !height) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(400)
        .json({ message: "Email is already Used", success: false });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);
    await User.create({
      name,
      email,
      password: hashPass,
      age,
      weight,
      height,
    });
    
    return res
      .status(200)
      .json({ message: "User successfully Registered", success: true });
  } catch (error) {
    console.log(error);
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!password || !email) {
      return res.status(400).json({
        message: "Something is missing",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect) {
      return res.status(400).json({
        message: "Incorrect email or password",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
    user = {
      _id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.status(200).cookie("token", token, {
      maxAge: 1 * 24 * 60 * 60 * 1000, // Cookie expires in 1 day
      httpOnly: true, // Prevent JavaScript from accessing the cookie
      sameSite: 'strict', // Prevent cross-site request forgery
      secure: process.env.NODE_ENV === 'production', // Only send cookie over HTTPS in production
    }).json({
      message: `Welcome back ${user.name}`,
      success: true,
      user,
      token, // Optionally you can omit sending the token in the JSON response for added security
    });
  
  } catch (error) {
    console.log('Login error:', error);
    return res.status(500).json({
      message: "An internal server error occurred.",
      success: false,
    });
  }
};


export const logout=async(req,res)=>{
  try {
    return res.status(200).cookie("token", "", {maxAge:0}).json({
      message:"Logged Out Successfully ",
      success:true
    })
  } catch (error) {
    console.log(error)
  }
}

// Daily Summary API
export const getSummary = async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date();

    // Get start and end of the day in UTC as ISO strings
    const startOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate())).toISOString();
    const endOfDay = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1)).toISOString();

    // Calculate the start of the week (7 days ago) and end of today
    const startOfWeek = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() - 6)).toISOString();
    const endOfToday = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + 1)).toISOString();

    // Query today's workouts and meals
    const todaysWorkouts = await WorkOut.find({
      user: userId,
      date: { $gte: new Date(startOfDay), $lt: new Date(endOfDay) },
    });

    const todaysMeals = await Meal.find({
      user: userId,
      date: { $gte: new Date(startOfDay), $lt: new Date(endOfDay) },
    });

    // Query weekly workouts and meals
    const weeklyWorkouts = await WorkOut.find({
      user: userId,
      date: { $gte: new Date(startOfWeek), $lt: new Date(endOfToday) },
    });

    const weeklyMeals = await Meal.find({
      user: userId,
      date: { $gte: new Date(startOfWeek), $lt: new Date(endOfToday) },
    });

    // Calculate today's totals
    const totalCaloriesBurnedToday = todaysWorkouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);
    const totalCaloriesConsumedToday = todaysMeals.reduce((sum, meal) => sum + meal.calories, 0);
    const totalWorkoutsToday = todaysWorkouts.length;
    const totalMealsToday = todaysMeals.length;

    // Calculate workout percentage based on today's categories
    const categoryCountsToday = {};
    todaysWorkouts.forEach((workout) => {
      if (categoryCountsToday[workout.category]) {
        categoryCountsToday[workout.category] += 1;
      } else {
        categoryCountsToday[workout.category] = 1;
      }
    });

    const categoryPercentagesToday = Object.keys(categoryCountsToday).map((category) => ({
      category,
      percentage: totalWorkoutsToday > 0 ? ((categoryCountsToday[category] / totalWorkoutsToday) * 100).toFixed(2) : 0,
    }));

    // Create an array of 7 days for weekly data
    const weeklyDataCalorieBurned = Array(7).fill().map((_, i) => {
      const date = new Date(today);
      date.setUTCDate(today.getUTCDate() - i);
      return {
        date: date.toISOString().split("T")[0],
        caloriesBurned: 0,
      };
    }).reverse();

    const weeklyDataCalorieConsumed = Array(7).fill().map((_, i) => {
      const date = new Date(today);
      date.setUTCDate(today.getUTCDate() - i);
      return {
        date: date.toISOString().split("T")[0],
        caloriesConsumed: 0,
      };
    }).reverse();

    // Aggregate calories burned and consumed for the week
    weeklyWorkouts.forEach((workout) => {
      const workoutDate = new Date(workout.date).toISOString().split("T")[0];
      const dayEntryBurned = weeklyDataCalorieBurned.find(day => day.date === workoutDate);
      if (dayEntryBurned) {
        dayEntryBurned.caloriesBurned += workout.caloriesBurned;
      }
    });

    weeklyMeals.forEach((meal) => {
      const mealDate = new Date(meal.date).toISOString().split("T")[0];
      const dayEntryConsumed = weeklyDataCalorieConsumed.find(day => day.date === mealDate);
      if (dayEntryConsumed) {
        dayEntryConsumed.caloriesConsumed += meal.calories;
      }
    });

    // Calculate total, average, and percentages for the week
    const totalCaloriesBurnedWeek = weeklyDataCalorieBurned.reduce((sum, day) => sum + day.caloriesBurned, 0);
    const totalCaloriesConsumedWeek = weeklyDataCalorieConsumed.reduce((sum, day) => sum + day.caloriesConsumed, 0);
    const avgCaloriesBurnedWeek = totalCaloriesBurnedWeek / 7;
    const avgCaloriesConsumedWeek = totalCaloriesConsumedWeek / 7;

    // Calculate workout percentage based on weekly categories
    const categoryCountsWeek = {};
    weeklyWorkouts.forEach((workout) => {
      if (categoryCountsWeek[workout.category]) {
        categoryCountsWeek[workout.category] += 1;
      } else {
        categoryCountsWeek[workout.category] = 1;
      }
    });

    const totalWorkoutsWeek = weeklyWorkouts.length;
    const categoryPercentagesWeek = Object.keys(categoryCountsWeek).map((category) => ({
      category,
      percentage: totalWorkoutsWeek > 0 ? ((categoryCountsWeek[category] / totalWorkoutsWeek) * 100).toFixed(2) : 0,
    }));

    // Return both daily and weekly summaries with separated data for calories burned and consumed
    return res.status(200).json({
      dailySummary: {
        totalWorkouts: totalWorkoutsToday,
        totalMeals: totalMealsToday,
        totalCaloriesBurned: totalCaloriesBurnedToday,
        totalCaloriesConsumed: totalCaloriesConsumedToday,
      },
      weeklySummary: {
        weeklyDataCalorieBurned,
        weeklyDataCalorieConsumed,
        totalCaloriesBurned: totalCaloriesBurnedWeek,
        totalCaloriesConsumed: totalCaloriesConsumedWeek,
        avgCaloriesBurned: avgCaloriesBurnedWeek,
        avgCaloriesConsumed: avgCaloriesConsumedWeek,
        categoryPercentages: categoryPercentagesWeek,
      },
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};




export const getUserDashBoard=async(req,res)=>{
  try {
    
  } catch (error) {
    console.log(error)
  }
}