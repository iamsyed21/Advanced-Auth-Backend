import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../model/user.js";

const protect = asyncHandler(async (req, res, next) =>{

    let token;
    token = req.cookies.jwt;

    if(token){
        try{
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.userID).select("-password");
            next();
        }catch{
            res.status(401);
            throw new Error("Not Authrorized, invalid token");    
        }
    }else{
        res.status(401);
        throw new Error("Not Authrorized, no token found");
    }
})

export {protect};