import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    website:{
        type:String
    },
    location:{
        type:String,
    },
    logo:{
        type:String, // url to companty logo
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User', 
        require:true
    }
},{timestamps:true});


const companyModel = mongoose.model("Company",companySchema);

export default companyModel;
