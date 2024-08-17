import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin','Doctor','Staff','Patient'],
        default: 'Patient'
    }
},{
    timestamps: true
})

userSchema.pre("save",async function(next) {
    if(!this.isModified('password')) return next()

    this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            username:this.username,
            email: this.email,
            role:this.role
        },
        process.env.JWT_TOKEN_SECRET,
        {
            expiresIn: process.env.JWT_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User",userSchema);

