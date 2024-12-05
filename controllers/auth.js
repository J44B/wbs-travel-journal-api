import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import ErrorResponse from '../utils/ErrorResponse.js';

export async function me(req, res) {
    const user = await User.findById(req.userId).select('-password');
    res.status(200).json(user);
}

export async function signin(req, res) {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) throw new ErrorResponse('Invalid credentials', 404);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new ErrorResponse('Unauthorized', 401);
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        sameSite: isProduction ? 'None' : 'Lax',
        secure: isProduction,
    };
    res.cookie('token', token, cookieOptions);
    res.status(201).json({ success: `Welcome back, ${user.firstName}.` });
}

export async function signout(req, res) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        sameSite: isProduction ? 'None' : 'Lax',
        secure: isProduction,
    };
    res.clearCookie('token', cookieOptions);
    res.status(200).json({ success: `Goodbye, unteil next time.` });
}

export async function signup(req, res) {
    const { firstName, lastName, email, password } = req.body;
    const alreayExists = await User.findOne({ email });
    if (alreayExists) throw new ErrorResponse('User already exists', 400);
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
        httpOnly: true,
        sameSite: isProduction ? 'None' : 'Lax',
        secure: isProduction,
    };
    res.cookie('token', token, cookieOptions);
    res.status(201).json({ success: 'welcome aboard' });
}
