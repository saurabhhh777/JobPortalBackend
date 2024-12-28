import express from "express";
import isAuth from "../Middlewares/isAuth.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus } from "../controllers/application.controller.js";
const applicationRouter = express.Router();

applicationRouter.route("/apply/:id").get(isAuth,applyJob);
applicationRouter.route("/get").get(isAuth,getAppliedJobs);
applicationRouter.route("/:id/applications").get(isAuth,getApplicants);
applicationRouter.route("/status/:id/update").post(isAuth,updateStatus);


export default applicationRouter;