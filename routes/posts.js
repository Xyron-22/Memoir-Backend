import express from 'express';
import {getPosts, getPost, getPostsBySearch, updatePost, deletePost, likePost, createPost, commentPost} from '../controllers/posts.js';
import {upload} from "./multerConfig.js";
import auth from "../middleware/auth.js";


const router = express.Router();

router.get("/search", getPostsBySearch);
router.get("/:id", getPost);
router.get('/', getPosts );
router.post('/', auth, upload.single("upload_image"), createPost);
router.patch("/:id", auth, updatePost);
router.delete("/:id", auth, deletePost);
router.patch("/:id/LikedPost", auth, likePost);
router.post("/:id/commentPost", auth, commentPost);

export default router;



