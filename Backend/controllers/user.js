import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import userModel from "../models/user.model.js"; // Ensure the path and extension are correct
dotenv.config({});



//register controller 
export const register = async (req, res) => {
  try {
    const { fullname, email, password, phoneNumber, role } = req.body;

    if (!fullname || !email || !password || !phoneNumber || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "User already exists with this email.",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await userModel.create({
      fullname,
      email,
      password: hashedPassword,
      phoneNumber,
      role,
    });

    return res.status(201).json({
      message: "User registered successfully!",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error, please try again later.",
      success: false,
    });
  }
};


//login controller
export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
      return res.status(400).json({
        message: "All fields are required.",
        success: false,
      });
    }

    let isUser = await userModel.findOne({ email });

    if (!isUser) {
      return res.status(400).json({
        message: "Incorrect email or password.",
        success: false,
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, isUser.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        message: "Incorrect password, please try again.",
        success: false,
      });
    }

    if (role !== isUser.role) {
      return res.status(400).json({
        message: "Please select the correct role.",
        success: false,
      });
    }

    const tokenData = {
      userId: isUser._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "7d" }); // Replace "yourSecretKey" with your actual secret key

    isUser = {
      _id:isUser._id,
      fullname:isUser.fullname,
      email:isUser.email,
      phoneNumber:isUser.phoneNumber,
      role:isUser.role,
      profile:isUser.profile,
    }

    return res.status(200).cookie("token",token,{
      maxAge:1*24*60*60*1000,
      httpsOnly:true,
      sameSite:'strict'
    }).json({
      message:`wellcome back ${isUser.fullname}`,
      isUser,
      success:true,
    });


  
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error, please try again later.",
      success: false,
    });
  }
};



//logout contollers
export const logout = (req,res)=>{
  try{
    return res.status(200).cookie("token","",{maxAge:0}).json({
      message:"Log out successfully ",
      success:true,
    });
  }
  catch(error){
    console.log(error);
  } 
}


//updating user profile 
export const updateProfile = async(req,res)=>{
  try {
    const {fullname,email,phoneNumber,bio,skills} = req.body;
    const file = req.file;
    // if (!fullname || !email || !phoneNumber || !bio || !skills ) {
    //   return res.status(400).json({
    //     message: "All fields are required.",
    //     success: false,
    //   });
    // }



    //later we use cloudnary in this section 
    let skillsArray
    if(skills) skillsArray = skills.split(",");
    const userId = req.id;
    let isUser = await userModel.findById(userId);

    if(!isUser){
      return res.status(400).json({
        message:`${isUser.fullname} not exist `,
        success:false,
      });
    }


    //updating the existing data in the mongoDb 
    if(fullname) isUser.fullname = fullname
    if(email) isUser.email = email
    if(phoneNumber) isUser.phoneNumber = phoneNumber
    if(bio) isUser.profile.bio = bio
    if(skills) isUser.profile.skills = skills


    await isUser.save();



    isUser = {
      _id:isUser._id,
      fullname:isUser.fullname,
      email:isUser.email,
      phoneNumber:isUser.phoneNumber,
      role:isUser.role,
      profile:isUser.profile,
    }

    return res.status(200).json({
      message:"Profile update successfully !",
      isUser,
      success:true,
    });


  } catch (error) {
    console.log(error);
  }

}
