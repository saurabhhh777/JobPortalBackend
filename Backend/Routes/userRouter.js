import express from 'express'
import isAuth from '../Middlewares/isAuth.js'
import { register,login,updateProfile, logout } from '../controllers/user.js'
const router = express.Router();


router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").post(logout); 
router.route("/profile/update").post(isAuth,updateProfile);


export default router