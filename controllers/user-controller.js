import User from "../model/user.js"
import asyncHandler from 'express-async-handler';
import generateToken from "../utils/generateToken.js";


//@desc Auth user/set token
// route Post /api/users/auth
// @access public
const authUser = asyncHandler(async (req, res) =>{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(user && (await user.matchPasswords(password))){
        generateToken(res, user._id);
        res.status(201).json({
            _id:user._id, name:user.name, email: user.email});
    }else{
        res.status(401);
        throw new Error("Invalid email or password");
    }
});

// test user - john1@email.com
// test user password - 123456


//@desc Register a new user
// route Post /api/users
// @access public
const registerUser = asyncHandler(async (req, res) =>{
    const { name, email, password } = req.body;
    const userExists = await User.findOne({email});
    if(userExists){
        res.status(400);
        throw new Error("Email already exists");
    }

    const user = await User.create({
        name,
        email,
        password
    });

    if(user){
        generateToken(res, user._id);
        res.status(201).json({
            _id:user._id, name:user.name, email: user.email});
    }else{
        res.status(400);
        throw new Error("INVALID USER DATA");
    }
    
});


//@desc Logout the user
// route Post /api/users/logout
// @access public
const logoutUser = asyncHandler(async (req, res) =>{
    res.cookie('jwt', '',{
        httpOnly: true,
        expires : new Date(0)
    })
    res.status(200).json({message:"Succesfully logged out"});
});



//@desc Get the user profile
// route Get /api/users/profile
// @access private
const getUserProfile = asyncHandler(async (req, res) =>{
    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        LastUpdated: req.user.updatedAt,
    }
    res.status(200).json({user});
});

//@desc update the user profile
// route Put /api/users/profile
// @access private
const updateUserProfile = asyncHandler(async (req, res) =>{
   const user = await User.findById(req.user._id);
   if(user){
    user.name = req.body.name ||  user.name;
    user.email = req.body.email ||  user.email;
    if(req.body.password){
        user.password= req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        LastUpdated: updatedUser.updatedAt,
    });

   }else{
    res.status(404);
    throw new Error("User not found");
   }
});



export{
    authUser,
    registerUser,
    logoutUser,
    getUserProfile,
    updateUserProfile
};


















// {const signup = async(req,res,next) =>{
//     const {name, email, password} = req.body;

//     let existingUser;
//     try{
//         existingUser = await User.findOne({email: email});
//     }catch(err){
//         return res.status(409).json("Email already exists! login instead");
//     }
//     if(existingUser){
//         return res.status(409).json("Email already exists! login instead");
//     }

//     const hashPassword = bcrypt.hashSync(password);
//     const user1= new User({name, email, password:hashPassword});
//     try{
//         await user1.save();
//         }catch(err){
//             return res.status(500).json({
//                 message:"Internal server error"
//             });
//         }

//     return res.status(201).json(
//         {
//             message: user1
//         }
//     )
// }

// const login = async(req,res,next) =>{
//     const {email, password} = req.body;

//     let existingUser;
//     try{
//         existingUser = await User.findOne({email:email});
//     }catch(err){
//         return next(err);
//     }
//     if(!existingUser){
//         res.status(404).json({
//             message: "User does not exist! Please recheck email or register"
//         });
//     }
//     //compare passwords and generate token
//     const isPaswordCorrect = bcrypt.compareSync(password, existingUser.password);
//     if(!isPaswordCorrect){
//         return  res.status(403).json('Incorrect Email / Password');
//     }
//     const token = jwt.sign({id:existingUser.id}, JWT_SECRET_KEY, {expiresIn:"2m"});

//     res.cookie(String(existingUser._id), token, {
//         path: "/", expires: new Date(Date.now() + 1000*120),
//         httpOnly: true, sameSite: "lax"
//     });

//     return res.status(200).json({
//         message:'Login Successful', user1:existingUser, token});
// };

// const verifyToken = (req,res,next) =>{
//     const cookies = req.headers.cookie;
//     const token= cookies.split("=")[1];
//     console.log(token);
//     if(!token){
//       return res.status(404).json({message:"No Token Found"});
//     }
//     //verify the token
//     jwt.verify(String(token), JWT_SECRET_KEY, (err, user) => {
//         if(err){
//           return  res.status(401).json({message:"Invalid Token"});
//         }
//         req.id = user.id;
        
//     });
//     next();
// };

// const getUser = async (req,res,next) =>{
//     const userID = req.id;
//     let user;
//     try{
//         user = await User.findById(userID, "-password");
//     }catch(err){
//         return next(err);
//     };

//     if(!user){
//         return res.status(404).json({message:"user doesn't exists"})
//     }


    
//     return res.status(200).json({user});
// };


// export {signup, login, verifyToken, getUser};}