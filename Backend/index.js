import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRouter from './Routes/userRouter.js';
import companyRouter from "./Routes/companyRouter.js";
import jobRouter from "./Routes/jobRouter.js";
import applicationRouter from "./Routes/applicationRouter.js";
dotenv.config();
connectDB();

const app = express();


// Default middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Corrected here

const corsOptions = {
    origin: "http://localhost:5173", // Fixed typo (missing colon)
    credentials: true,
};



app.use(cors(corsOptions));

//all api's are here    
app.use("/api/users",userRouter);
app.use("/api/company",companyRouter);
app.use("/api/job",jobRouter);
app.use("/api/application",applicationRouter);
 

const PORT =  process.env.PORT || 3000;

app.listen(PORT, ()=> {
    console.log(`Server Started! ${PORT}`);
});
