import mongoose, { Schema , model} from 'mongoose';
import { type } from 'os';
const userSchema = mongoose.Schema({
        username: String,
        name: String,
        age: Number,
    email:String,
    password:String,   
    profilePicture:{
        type:String,
        default:'bgimg.jpg'
    },
    posts: [
        {type: mongoose.Types.ObjectId , ref:"post"}
    ],
    })

export default mongoose.model('user' , userSchema);   