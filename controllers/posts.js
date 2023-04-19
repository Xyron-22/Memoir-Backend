import mongoose from "mongoose"
import postMessage from "../models/postMessage.js"
import fs from "fs";


export const getPosts = async (req, res) => {
    
    const {page} = req.query;
    
    try {
        const LIMIT = 8;
        const startIndex = (Number(page) - 1) * LIMIT;
        const total = await postMessage.countDocuments({});

        const posts = await postMessage.find().sort({_id: -1}).limit(LIMIT).skip(startIndex)
        
        res.status(200).json({data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total/LIMIT)});
               
    } catch (error) {   
        res.status(404).json({ message: error.message });
    }
};

export const getPost = async (req, res) => {
    const {id} = req.params;
    
    try {
        const post = await postMessage.findById(id);
        
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getPostsBySearch = async (req, res) => {
    const {searchQuery, tags} = req.query;
       
    try {
        const title = new RegExp(searchQuery, "i");
        const result = tags.split(",").map((value) => value = new RegExp(value, "i"))
        
        const posts = await postMessage.find( { $or: [ { title: title }, { tags: { $in: tags? result : !result}} ]} )
              
        res.json({ data: posts })
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createPost = async (req, res) => {
    const {name, title, message, tags} = req.body
  
        const newPost = new postMessage({
            creator: req.userId,
            name,
            title,
            message,
            tags: tags.split(","),
            selectedFile: {
                data: fs.readFileSync("uploads/" + req.file.filename),
                contentType: "image/png"
            },
            createdAt: new Date().toISOString()
        });
    
        try {
            await newPost.save().then(() => console.log("image saved."))
            res.status(201).json(newPost);
        } catch (error) {
            res.status(409).json({message: error.message});
        }
     
};

export const updatePost = async (req, res) => {
    const {id} = req.params;
    const post = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");

    const updatedPost = await postMessage.findByIdAndUpdate(id, post , {new: true});

    res.json(updatedPost);
};

export const deletePost =  async (req, res) => {
    const {id} = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send("No post with that id");

    await postMessage.findByIdAndDelete(id);
    
    res.json({ message: "Post deleted Succesfully"});
};

export const likePost = async (req, res) => {
    const {id} = req.params;
    
    if(!req.userId) {
        res.json({message: "Unauthenticated"});
    }
    
    if(!mongoose.Types.ObjectId.isValid) return res.status(404).send("No post with that id");

    const post = await postMessage.findById(id);
    
    const index = post.likes.findIndex((id) => id === req.userId);
       
    let postLikes;
    
    if(index === -1) {
        post.likes.push(req.userId);
        postLikes = post.likes;
    } else {
        postLikes = post.likes.filter((id) => id !== req.userId);
    }
                    
    const updatedPost = await postMessage.findByIdAndUpdate(id, {likes: postLikes }, {new: true});
   
    res.json(updatedPost);
};

export const commentPost = async (req, res) => {
    const {id} = req.params;
    const {value} = req.body;

    const post = await postMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await postMessage.findByIdAndUpdate(id, post, {new: true});

    res.json(updatedPost);
};


