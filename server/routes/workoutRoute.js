import express from "express"

import isAuthenticated from "../middleWare/isAuthenticated.js";
import { addWorkout, getWorkoutsByDate, removeWorkout } from "../controllers/workoutController.js";

const router=express.Router();
router.route('/add-workout').post(isAuthenticated,addWorkout)
router.route('/get-workout').get(isAuthenticated,getWorkoutsByDate)

router.route('/delete-workout/:workoutId').delete(isAuthenticated,removeWorkout)
export default router