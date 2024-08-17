import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler";

export const verifyJWT = asyncHandler( async (req, _res, next) => {
    const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer ","");

    if(!token){
        return new ApiError(401, "Unauthorized");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_TOKEN_SECRET)

    const user = User.findById(decodedToken?._id).select('-password')

    if(!user){
        return new ApiError(401, "Invalid Access Token" );
    }

    req.user = user;

    next();



})