import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    id: {
        type: String, 
    }
});

export default mongoose.model(process.env.NAME2 , userSchema);

