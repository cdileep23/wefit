import express from "express"
import { login, register ,logout, getSummary, checkToken} from "../controllers/userController.js";
import isAuthenticated from "../middleWare/isAuthenticated.js";


const router=express.Router();
router.route('/register').post(register)
router.route('/login').post(login)
router.route('/logout').get(isAuthenticated,logout)
router.route('/get-summary').get(isAuthenticated,getSummary)
router.route('/check-user').get(checkToken);

export default router