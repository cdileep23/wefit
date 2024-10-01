import express from "express"

import isAuthenticated from "../middleWare/isAuthenticated.js";
import { addMeal, getMealsByDate, removeMeal } from "../controllers/mealController.js";


const router=express.Router();
router.route('/add-meal').post(isAuthenticated,addMeal)
router.route('/get-meal').get(isAuthenticated,getMealsByDate)
router.route('/delete-meal/:mealId').delete(isAuthenticated,removeMeal)

export default router