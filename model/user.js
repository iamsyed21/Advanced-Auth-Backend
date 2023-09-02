import mongoose from "mongoose";
const Schema = mongoose.Schema;
import bcrypt from 'bcryptjs';

const userSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true,
        unique :true
    },
    password:{
        type:String,
        required: true,
        minlength: 6
    }
},{
    timestamps:true
});

userSchema.pre('save', async function(next){
    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPasswords = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password);
}
const User = mongoose.model('User', userSchema);

export default User;