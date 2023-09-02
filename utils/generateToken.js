import jwt from 'jsonwebtoken';


const generateToken = (res, userID) =>{
    const token = jwt.sign({userID}, process.env.JWT_SECRET, {expiresIn:"5m"});

    res.cookie('jwt', token, {
        httpOnly: true, //only accessible by the server side code and not client-side javascript
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'lax',
        maxAge: 5*60*1000
    });
};


export default generateToken;