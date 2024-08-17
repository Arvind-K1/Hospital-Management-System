import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser = asyncHandler( async (req, res, _next) => {
    const { name, email, password, age } = req.body;

    if(!name || !email || !password || !age){
        return new ApiError(400,"Please Enter all the details.")
    }
    const existingUser = await User.findOne({email});

    if(existingUser){
        return new ApiError(400,"Email already exists.")
    }
    const user = await User.create({name, email, password, age});

    if(!user){
        return new ApiError(500,"Error creating user.")
    }

    const createdUser = await User.findById(user._id).select('-password')

    if(!createdUser){
        return new ApiError(500,"Error fetching user.")
    }

    return res.status(201).json(
        new ApiResponse(201,"User created successfully.",createdUser)
    )

});

const loginUser = asyncHandler( async (req, res, _next) => {
    const { email, password } = req.body;

    if(!email || !password){
        return new ApiError(400,"Please Enter all the details.")
    }
     
    const user = await User.findOne({email}).select('+password')

    if(!user){
        return new ApiError(401,"Invalid email or password.")
    }
    
    const isPasswordValid = await user.isPasswordCorrect(password);

    if(!isPasswordValid){
        return new ApiError(401,"Invalid password.")
    }
    
    const token = user.generateToken();

    if(!token){
        return new ApiError(500,"Error generating token.")
    }

    const loggedInUser = await User.findById(user._id).select('-password');
    
    if(!loggedInUser){
        return new ApiError(500,"Error fetching user.")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
            .status(200)
            .cookie('token',token,options)
            .json(
                new ApiResponse(200,"User logged in successfully.",loggedInUser)
            )

});

const logoutUser = asyncHandler( async (req, res, _next) => {
    const token = req.cookies.token;

    if(!token){
        return new ApiError(401,"Please login first.")
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
            .status(200)
            .clearCookie('token',options)
            .json(
                new ApiResponse(200,"User logged out successfully.")
            )


});

const changeCurrentPassword = asyncHandler( async (req, res, _next) => {
    const { oldPassword, newPassword } = req.body;

    if(!oldPassword || !newPassword){
        return new ApiError(400,"Please fill in all fields.")
    }
    
    const user = await User.findById(req.user?._id);

    if(!user){
        return new ApiError(500,"Error fetching user.")
    }

    const isPasswordCorrect = user.isPasswordCorrect(oldPassword);

    if(!isPasswordCorrect){
        return new ApiError(401,"Old password is incorrect.")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave: false})

    return res.status(200).json(
        new ApiResponse(200,"Password changed successfully.")
    )


});

const updateAccountDetails = asyncHandler( async (req, res, _next) => {
    const {name, email, age} = req.body;

    if(!name || !email || !age){
        return new ApiError(400,"Please fill in all fields.")
    }

    const user = User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                name: name,
                email: email,
                age: age
            }
        },{
            new: true
        }
    ).select('-password')

    if(!user){
        return new ApiError(500,"Error updating user.")
    }

    return res.status(201).json(
        new ApiResponse(201,"Account details updated successfully.",user)
    )
})

export {
    registerUser,
    loginUser,
    logoutUser,
    changeCurrentPassword,
    updateAccountDetails
}


