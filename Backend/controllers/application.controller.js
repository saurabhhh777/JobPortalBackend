import applicationModel from "../models/application.model.js";
import jobModel from "../models/job.model.js";


export const applyJob = async(req,res)=>{
    try {
        const userId = req.id;
        const jobId = req.params.id;
        if(!jobId){
            return res.status(400).json({
                message:"Job id is reqired !",
                success:false,
            });
        };
        
        const existingApplication = await applicationModel.findOne({job:jobId,applicant:userId});
        if(existingApplication){
            return res.status(400).json({
                message:"You are already applied for this job",
                success:false,
            });
        };
         

        //check if the job exists 
        const isJob = await jobModel.findById(jobId);
        if(!isJob){
            return res.status(400).json({
                message:"Bhai job nahi mil rahi hai",
                success:false,
            });
        };


        //create a new application 
        const newApplication = await applicationModel.create({
            job:jobId,
            applicant:userId,
        });

        isJob.application.push(newApplication._id);
        await isJob.save(); 

        return res.status(201).json({
            message:"Job Applied !",
            success:true,
        });

    } catch (error) {
        console.log(error);
    }
}


export const getAppliedJobs = async (req,res)=>{
    try {
        const userId = req.id;
        const application = await applicationModel.find({applicant:userId}).sort({createdAt:-1}).populate({
           path:"job", 
           options:{sort:{createdAt:-1}},
           populate:{
                path:"company",
                options:{sort:{createdAt:-1}},
           }
        });

        if(!application){
            return res.status(404).json({
                message:"Application not found ",
                success:false,
            });
        }


        return res.status(200).json({
            application,
            success:true,
        });


    } catch (error) {
        console.log(error);
    }

}


//admin can see how many student apply on it 
export const getApplicants = async (req,res)=>{
    try {
        const jobId = req.params.id;
        const job = await jobModel.findById(jobId).populate({
            path:"application",
            options:{sort:{createdAt:-1}},
            populate:{
                path:"applicant",
            }
        });

        if(!job){
            return res.status(404).json({
                message:"Job not found ",
                success:false,
            });
        }

        return res.status(200).json({
            job,
            success:true,
        });  

    } catch (error) {
        console.log(error);
    }
}


export const updateStatus = async (req,res)=>{
    try {
        const status = req.body;
        const applicationId = req.params.id; 
        if(!status){
            return res.status(400).json({
                message:"Status not found !",
                success:false,
            });
        }

        const application = await applicationModel.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found !",
                success:false,
            });
        };

        application.status = status.toLowerCase ;
        await application.save();


        return res.status(200).json({
            message:"Status Updated !",
        });

    } catch (error) {

        console.log(error);
    }

}