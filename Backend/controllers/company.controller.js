import companyModel from "../models/company.model.js";

export const registerCompany = async (req,res)=>{
    try {   
        const {companyName} = req.body;
        if(!companyName){
            return res.status(400).json({
                message:"please enter company name !",
                success:false,
            });
        }

        let isExist = await companyModel.findOne({
            name:companyName
        });  

        if(isExist){
            return res.status(400).json({
                message:"You can't register same company ",
                success:false
            });
        };

        isExist = await companyModel.create({
            name:companyName,
            userId:req.id
        });

        return res.status(200).json({
            message:"Company register successfully !",
            isExist, 
            success:true,
        });

        
    } catch (error) {
        console.log(error);
    }

}

//getCompany controller is use for whenever some create a job, it will give them
//all company list in which they create job 

export const getCompany = async (req,res)=>{
    try {
        
        //this will give list of company which is created by only me, mean to say not give other company
        //list in your profile section
        const userId = req.id;
        const companies = await companyModel.find({userId});
        
        if(!companies){
            return res.status(404).json({
                message:"Companies not found !",
                success:false,
            });
        }
        
        return res.status(200).json({
            companies,
            success:true
        });


    } catch (error) {
        console.log(error);
    }
}


//get company by id 
export const getCompanyById = async (req,res)=>{
    try {
        const companyId = req.params.id;
        const company = await companyModel.findById(companyId);
        if(!company){
            return res.json({
                message:"Company not found",
                success:false
            });
        }

        return res.status(200).json({
            company,
            success:true
        });

    } catch (error) {
        console.log(error);
    }

}


//forupdating the companyDetails
export const updateCompany = async (req,res)=>{
    try {
        const {name,description,website,location} = req.body;
        const file = req.file;
        
        const updateData = {name,description,website,location};

        const company = await companyModel.findByIdAndUpdate(req.params.id,updateData,{new:true});

        if(!company){
            return res.status(404).json({
                message:"Company not found",
                success:false
            });
        }


        return res.status(200).json({
            message:"Your data is successfully update ",
            success:true

        });

    } catch (error) {
        console.log(error);
    }

}