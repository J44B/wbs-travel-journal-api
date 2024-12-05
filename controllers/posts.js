import { isValidObjectId } from 'mongoose';
import Post from '../models/Post.js';

import ErrorResponse from '../utils/ErrorResponse.js';

export async function getAllPosts(req, res, next) {
    const posts = await Post.find().populate('author', '_id');
    res.json(posts);
}

export async function getSinglePost(req, res, next) {
    const {
        params: { id },
    } = req;
    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);
    const post = await Post.findById(id).populate('author', '_id');
    if (!post) throw new ErrorResponse(`Post with id ${id} doesn't exist`, 404);
    res.json(post);
}

export async function createPost(req, res, next) {
    const { body } = req;
    const newPost = await Post.create({ ...body });
    const postWithAuthor = await newPost.populate('author', '_id');
    res.status(201).json(postWithAuthor);
}

export async function updatePost(req, res, next) {
    const {
        body,
        params: { id },
        userId,
    } = req;
    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);
    const updatedPost = await Post.findByIdAndUpdate(id, body, {
        new: true,
    }).populate('author', '_id');
    if (!updatedPost)
        throw new ErrorResponse(`Post with id ${id} doesn't exist`, 404);

    if (updatedPost.author._id.toString() !== userId)
        throw new ErrorResponse('Not authorized to edit this post, 403');
    res.json(updatedPost);
}

export async function deletePost(req, res, next) {
    const {
        params: { id },
        userId,
    } = req;
    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);
    const post = await Post.findByIdAndDelete(id).populate('author');
    if (!post) throw new Error(`Post with id ${id} doesn't exist`);

    if (post.author._id.toString() !== userId)
        throw new ErrorResponse('Not authorized to delete this post, 403');

    await Post.findByIdAndDelete(id);
    res.json({ success: `Post with id ${id} was deleted` });
}
