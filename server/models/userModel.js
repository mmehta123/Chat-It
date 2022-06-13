const mongoose=require("mongoose");

const userSchema=new mongoose.Schema({
    username:{type:String,required:true,unique:true,min:3,max:20},
    email: { type: String, required: true, unique: true, min: 3, max: 20 },
    password: { type: String, required: true, unique: true,max: 50 },
    confirmPassword: { type: String, required: false, min: 8 },
    isAvatarImageSet:{type:Boolean,default:false},
    avatarInage:{type:String,default:""}
},
{
    versionKey:false,
    
});

module.exports=mongoose.model("users",userSchema);