import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    role:{
        type:String,
        enum:["Instructor","Student"],
        default:"Student"
    },
    enrolledCourses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        }
    ],
    photoUrl:{
        type:String,
        default:"",
    }
},
{timestamps:true}
)

const user = mongoose.model("User",userSchema)
export default user