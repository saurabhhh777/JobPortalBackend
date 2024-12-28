import express from "express";
import isAuth from "../Middlewares/isAuth.js";
import { getAdminJobs, getAllJobs, getJobById, postJob } from "../controllers/job.controller.js";
const router = express.Router();

router.route("/posts").post(isAuth,postJob);
router.route("/get").get(isAuth,getAllJobs);
router.route("/getadminjobs").get(isAuth,getAdminJobs);
router.route("/get/:id").get(isAuth,getJobById);


export default router;