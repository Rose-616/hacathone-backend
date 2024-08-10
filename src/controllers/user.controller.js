import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"; //Api Error helps to throw errors
import {User} from "../models/user.model.js"; //getting Data from user model file
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import  Jwt  from "jsonwebtoken";
import { v2 as cloudinary } from 'cloudinary';

const generateAccessAndReferenshTokens= async(userId) => 
{
    try{
        const user= await  User.findById(userId)
     const accessToken =   user.generateAccessToken()
     const refreshToken =   user.generateRefreshToken()

     user.refreshToken=refreshToken
    await user.save({validateBeforeSave  : false})
    console.log("This is Acces while login",accessToken)

    return {accessToken , refreshToken}
    
    } catch(error){
        throw new ApiError(500, "Something went wrong while generating Referesh and Access Token")
    }


}
// user.controller.js



const registerUser = async (req, res) => {
  console.log("Register Api hitted")
  try {
    const { username, email, password } = req.body;
    const lowercaseUsername = username ? username.toLowerCase() : null;

    // Validation checks
    if (!email.trim()) {
      throw new ApiError(400, "Email is required");
    }
    if (!password.trim()) {
      throw new ApiError(400, "Password is required");
    }

    // Check if username already exists
    const existingUserByUsername = await User.findOne({ username: lowercaseUsername });
    if (existingUserByUsername) {
      throw new ApiError(409, 'Username already exists');
    }

    // Check if email already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      throw new ApiError(409, 'Email already exists');
    }

    // Check if avatar file was uploaded
    const avatarFile = req.file;
    if (!avatarFile || !avatarFile.path) {
      throw new ApiError(400, "Avatar File upload failed");
    }

    // Upload avatar to Cloudinary
    const avatar = await cloudinary.uploader.upload(avatarFile.path, {
      folder: "avatars"
    });

    if (!avatar) {
      throw new ApiError(400, "Avatar File upload failed");
    }

    // Create new user with uploaded avatar URL
    const newUser = await User.create({
      avatar: avatar.secure_url,
      email,
      password,
      username: lowercaseUsername,
      admin: false
    });

    // Respond with success message or redirect
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(error.statusCode || 500).json({
      message: error.message || "Registration failed. Please try again later.",
    });
  }
};


const generateTokens = async (userId) => {
    const { accessToken, refreshToken } = await generateAccessAndReferenshTokens(userId);
    return { accessToken, refreshToken };
  };

  const loginUser = asyncHandler(async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            throw new ApiError(400, "Email is required");
        }

        const user = await User.findOne({ email });

        if (!user) {
            throw new ApiError(400, "User does not exist");
        }

        const isPasswordValid = await user.isPasswordCorrect(password);

        if (!isPasswordValid) {
            throw new ApiError(401, "Password is invalid");
        }

        const { accessToken, refreshToken } = await generateTokens(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

        console.log("Generated Access Token:", accessToken);

        const options = {
            httpOnly: false,
            secure: false, // Change to false if not serving over HTTPS in development
        };

        res.cookie('myAccessToken', accessToken, options);
        res.cookie('myRefreshToken', refreshToken, options);

        // Log a message indicating that cookies are being set
        console.log("Cookies are being set!");

        // Check if the user is an admin
        if (loggedInUser.admin==="true") {
            console.log("Admin logged in!");
         
        } else {
            console.log("Customer logged in!");
            
        }
        const isAdmin = loggedInUser.admin === "true";
        console.log("This is Functionalty of User",isAdmin)
        // Send a simplified response
        res.status(200).json({
            user: loggedInUser,
            accessToken,
            refreshToken,
            isAdmin,
            message: "User Logged In Successfully",
        });
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(error.status || 500).json({
            error: {
                status: error.status || 500,
                message: error.message,
            },
        });
    }
});

  

const logoutUser = asyncHandler(async(req , res) => {
 User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{
            refreshToken:undefined
        },
        
    },
    {
        new:true
    }
 )

 const options={

    httpOnly: true,
    secure:true
}
    return res
    .status(200)
    .clearCookie("accessToken" , options)
    .clearCookie("refreshToken" , options)
    .json(new ApiResponse(200, {}, "User Logged out"))
}) 


const refreshAccessToken = asyncHandler(async(req , res) => {

   const incomingRefreshToken= req.cookie.refreshToken||req.body.refreshToken
   if(!incomingRefreshToken){
    throw new ApiError(401, "Unauthorized request")
   }

   try {
    const decodedToken=Jwt.verify(
     incomingRefreshToken,
     process.env.REFRESH_TOKEN_SECRET
    )
 
    const user= await User.findById(decodedToken?._id)
    if(!user){
     throw new ApiError(401, "Invalid refresh Token")
    }
 
 
    if(incomingRefreshToken !==user?.refreshToken){
     throw new ApiError(401, "refresh Token is Expired or Used")
    }
 
 
    const options = {
        httpOnly: false,
        secure: false,
        
      };
  
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        // .json(
        //   new ApiResponse(200, {
            // user: logedInUser,
            // accessToken,
            // refreshToken,
        //   },
        //   "User Logged In Successfully"
        //   )
        // );
  
      // Log a message indicating that cookies are being set
      console.log("Cookies are being set!");
      res.redirect('/yourblog');
  
    } catch (error) {
      console.error("Error in loginUser:", error);
      res.status(error.status || 500).json(new ApiResponse(error.status || 500, null, error.message));
    }
  });
  


const changeCurrentPassword = asyncHandler(async(req , res) =>{

    const {oldPassword , newPassword, confPassword}=req.body

if(!(newPassword==confPassword)){
    throw new ApiError(401, "New Password and Confrim Passwrod Mismatch")

}

 const user=await User.findById(req.user?._id)
  const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)
  
  if(!isPasswordCorrect){
    throw new ApiError(401, "Invalid old Password")
  }

  user.password=newPassword
 await user.save({validateBeforeSave:false})

 return res
 .status(200)
 .json(new ApiResponse(200, {}, "Password Changed SccessFully"))
})


const getCurrentUser=asyncHandler(async(req, res) => {

  
    return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current User fetched"))
})



const updateAccountsDetails=asyncHandler(async(req ,res) => {

    const {username , email}=req.body


    if(!username || !email){
        throw new ApiError(400, "All field are required")
    }
    const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                username,
                email
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, ("Account details Updated Successfuly")))
})



const updateUserAvatar=asyncHandler(async(req, res) =>{

   const avatarLocalPath= req.file?.path

   if(!avatarLocalPath){
    throw new ApiError(400, "Avatar File is missing")

   }

 const avatar = await uploadOnCloudinary(avatarLocalPath)
 
   if(!avatar.url){
    throw new ApiError(400, "Error while Uplaodeing avatar file")

   }
const user=await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set:{
                avatar:avatar.url
              
            }
        },
       

       {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiResponse(200, user, ("Avatar Updated Successfuly"))
)
    
})


  

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountsDetails,
    updateUserAvatar,
   

}