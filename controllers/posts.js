import { isValidObjectId } from 'mongoose';
import Post from '../models/Post.js';

import ErrorResponse from '../utils/ErrorResponse.js';

export async function getAllPosts(req, res, next) {
    const posts = await Post.find().populate('author');
    res.json(posts);
}

export async function createPost(req, res, next) {
    const { body } = req;
    const newPost = await (await Post.create({ ...body })).populate('author');
    res.status(201).json(newPost);
}

export async function getSinglePost(req, res, next) {
    const {
        params: { id },
    } = req;
    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);
    const post = await Post.findById(id).populate('author');
    if (!post)
        throw new ErrorResponse(`Post with id of ${id} doesn't exist`, 404);
    res.send(post);
}

export async function updatePost(req, res, next) {
    const {
        body,
        params: { id },
    } = req;
    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);
    const updatedPost = await Post.findByIdAndUpdate(id, body, {
        new: true,
    }).populate('author');
    if (!updatedPost)
        throw new ErrorResponse(`Post with id of ${id} doesn't exist`, 404);
    res.json(updatedPost);
}

export async function deletePost(req, res, next) {
    const {
        params: { id },
    } = req;
    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid id', 400);
    const deletedPost = await Post.findByIdAndDelete(id).populate('author');
    if (!deletedPost) throw new Error(`Post with id ${id} doesn't exist`);
    res.json({ success: `Post with id ${id} was deleted` });
}
