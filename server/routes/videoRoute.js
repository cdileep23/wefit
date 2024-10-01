import express from "express"
import isAuthenticated from "../middleWare/isAuthenticated.js";
import { addVideo, getAllVideosByUser, removeVideo } from "../controllers/videoController.js";


const router=express.Router();
router.route('/add-video').post(isAuthenticated,addVideo)
router.route('/remove-video/:videoId').delete(isAuthenticated,removeVideo)

router.route('/get-all').get(isAuthenticated,getAllVideosByUser)
export default router