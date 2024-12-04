import { Router } from 'express';
import validateJOI from '../middlewares/validateJOI.js';
import {
    createPost,
    deletePost,
    getAllPosts,
    getSinglePost,
    updatePost,
} from '../controllers/posts.js';
import { postSchema } from '../joi/schemas.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const postsRouter = Router();

postsRouter
    .route('/')
    .get(getAllPosts)
    .post(verifyToken, validateJOI(postSchema), createPost);

postsRouter
    .route('/:id')
    .get(getSinglePost)
    .put(validateJOI(postSchema), updatePost)
    .delete(deletePost);

export default postsRouter;
