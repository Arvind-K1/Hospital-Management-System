import { Router } from "express";
import { changeCurrentPassword, loginUser, logoutUser, registerUser, updateAccountDetails } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)

router.route('logout').post(verifyJWT, logoutUser)
router.route('change-password').post(verifyJWT, changeCurrentPassword)
router.route('/update-details').patch(verifyJWT, updateAccountDetails)

export default router;
