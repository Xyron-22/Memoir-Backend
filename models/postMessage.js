import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const postSchema = mongoose.Schema({
    title: String,
    message: String,
    name: String,
    creator: String,
    tags: [String],
    selectedFile: {
        data: Buffer,
        contentType: String,
    },
    likes: {
        type: [String],
        default: []
    },
    comments: {
        type: [String],
        default: []
    },
    createdAt: {
        type: Date,
        default: new Date()
    }
});

const postMessage = mongoose.model(process.env.NAME1 , postSchema);


export default postMessage;