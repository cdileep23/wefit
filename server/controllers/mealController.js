import Meal from "../models/mealsModel.js"
import User from "../models/userModel.js";
export const addMeal = async (req, res) => {
    try {
        const { mealName, calories, category } = req.body; // Include category
        const userId = req.userId; // Assuming user authentication middleware

        if (!mealName || calories == null || !category) { // Check for category
            return res.status(400).json({
                message: "Required fields missing",
                success: false
            });
        }

        // Create a new meal entry
        const newMeal = await Meal.create({
            user: userId,
            mealName,
            calories,
            category // Include category in the entry
        });

        return res.status(201).json({
            message: "Meal added successfully",
            success: true,
            meal: newMeal
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server Error",
            success: false
        });
    }
};
export const getMealsByDate = async (req, res) => {
    try {
        const userId = req.userId; // Get user ID from request
        const user = await User.findById(userId); // Find user by ID

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        // Get the date from the query parameters or use the current date
        let date = req.query.date ? new Date(req.query.date) : new Date();

        // Set the start and end of the day
        const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const endOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);

        // Find meals for the user within the specified date range
        const todaysMeals = await Meal.find({
            user: userId, // Match by user field
            date: { $gte: startOfDay, $lt: endOfDay },
        });

        // Calculate total calories consumed
        const totalCaloriesConsumed = todaysMeals.reduce(
            (total, meal) => total + (meal.calories || 0), // Handle potential null values
            0
        );

        return res.status(200).json({ todaysMeals, totalCaloriesConsumed, success: true });
    } catch (err) {
        console.error(err); // Log the error for debugging
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};
export const removeMeal = async (req, res) => {
    try {
        const { mealId } = req.params; // Get meal ID from request parameters
        const userId = req.userId; // Get user ID from request

        // Find the meal by ID and ensure it belongs to the user
        const meal = await Meal.findOneAndDelete({
            _id: mealId,
            user: userId
        });

        if (!meal) {
            return res.status(404).json({ message: "Meal not found", success: false });
        }

        return res.status(200).json({
            message: "Meal removed successfully",
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

