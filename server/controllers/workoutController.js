
import workOut from "../models/workoutModel.js"
import User from "../models/userModel.js";
import WorkOut from "../models/workoutModel.js"; // Assuming this is the model

// A simple function to calculate calories based on workout details
const calculateCalories = (sets, weight, duration) => {
  // This is a basic example, you can adjust the logic
  const caloriePerSet = weight ? weight * 0.1 : 5; // Assuming weight contributes to calories
  const caloriePerMinute = duration ? duration * 0.2 : 3; // Assuming duration contributes
  return (sets * caloriePerSet)* 10 + caloriePerMinute;
};
function convertDateString(dateString) {
  // Create a new Date object from the input string
  const date = new Date(dateString);

  // Format the date as YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
export const addWorkout = async (req, res) => {
  try {
    const { category, workoutName, sets, weight, duration, date } = req.body; // Include date
    const userId = req.userId; // Assuming user authentication middleware
    
    if (!category || !workoutName || !sets || !date) { // Check for required fields
      return res.status(400).json({
        message: "Required fields missing",
        success: false
      });
    }

    // Parse the date and subtract one day
    const workoutDate = new Date(date);
    workoutDate.setDate(workoutDate.getDate() - 1); // Subtract one day

    // Calculate calories
    const caloriesBurned = calculateCalories(sets, weight, duration);

    // Create a new workout entry
    const newWorkout = await WorkOut.create({
      user: userId,
      category,
      workoutName,
      sets,
      weight,
      duration,
      date: workoutDate, // Store the modified date (day before)
      caloriesBurned
    });

    return res.status(201).json({
      message: "Workout added successfully",
      success: true,
      workout: newWorkout
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server Error",
      success: false
    });
  }
};




export const getWorkoutsByDate = async (req, res) => {
  try {
    const userId = req.userId; // Get user ID from request
    const user = await User.findById(userId); // Find user by ID

    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    // Get the date from the query parameters or use the current date
    const dateString = req.query.date || new Date().toISOString().split('T')[0]; // Format to YYYY-MM-DD if not provided
    const date = new Date(dateString); // Convert to Date object

    // Validate the date
    if (isNaN(date.getTime())) {
      return res.status(400).json({ message: "Invalid date format", success: false });
    }

    console.log(date); // For debugging

    // Set the start and end of the day in UTC
    const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
    const endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + 1));

    // Find workouts for the user within the specified date range
    const todaysWorkouts = await workOut.find({
      user: userId, // Match by user field
      date: { $gte: startOfDay, $lt: endOfDay },
    });

    // Calculate total calories burned
    const totalCaloriesBurnt = todaysWorkouts.reduce(
      (total, workout) => total + (workout.caloriesBurned || 0), // Handle potential null values
      0
    );

    console.log(todaysWorkouts);

    return res.status(200).json({
      message: "Successfully fetched",
      todaysWorkouts,
      totalCaloriesBurnt,
      success: true
    });
  } catch (err) {
    console.error(err); // Log the error for debugging
    return res.status(500).json({ message: "Internal server error", success: false });
  }
};


export const removeWorkout = async (req, res) => {
  try {
      const { workoutId } = req.params; // Get workout ID from request parameters
      const userId = req.userId; // Get user ID from request

      // Find the workout by ID and ensure it belongs to the user
      const workout = await WorkOut.findOneAndDelete({
          _id: workoutId,
          user: userId
      });

      if (!workout) {
          return res.status(404).json({ message: "Workout not found", success: false });
      }

      return res.status(200).json({
          message: "Workout removed successfully",
          success: true
      });
  } catch (error) {
      console.error(error);
      return res.status(500).json({
          message: "Server Error",
          success: false
      });
  }
};


