import { isValidObjectId } from 'mongoose';
import User from '../models/User.js';

import ErrorResponse from '../utils/ErrorResponse.js';

export async function getAllUsers(req, res, next) {
    const users = await User.find();
    res.json(users);
}

export async function getSingleUser(req, res, next) {
    const {
        params: { id },
    } = req;
    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid ID', 400);
    const user = await User.findById(id);
    if (!user) throw new ErrorResponse(`User with id ${id} doesn't exist`, 404);
    res.json(user);
}

export async function createUser(req, res, next) {
    const { body } = req;
    const newUser = await User.create({ ...body });
    res.status(201).json(newUser);
}

export async function updateUser(req, res, next) {
    const {
        body,
        params: { id },
    } = req;
    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid ID', 400);
    const updatedUser = await User.findByIdAndUpdate(id, body, {
        new: true,
    });
    if (!updatedUser)
        throw new ErrorResponse(`User with id ${id} doesn't exist`, 404);
    res.json(updatedUser);
}

export async function deleteUser(req, res, next) {
    const {
        params: { id },
    } = req;
    if (!isValidObjectId(id)) throw new ErrorResponse('Invalid ID', 400);
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser)
        throw new ErrorResponse(`User with id ${id} doesn't exist`, 404);
    res.json({ success: `User with id ${id} was deleted` });
}
