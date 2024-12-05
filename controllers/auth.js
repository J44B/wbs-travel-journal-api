import User from '../models/User.js';
import ErrorResponse from '../utils/ErrorResponse.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;
const secret = process.env.JWT_SECRET;

export async function getAllUsers(req, res, next) {
    const users = await User.find();
    res.json(users);
}

export async function me(req, res) {
    const user = await User.findById(req.userId);
    res.status(200).json(user);
}

export async function signup(req, res) {
    const { firstName, lastName, email, password } = req.body;

    const alreadyExists = await User.findOne({ email });
    if (alreadyExists) throw new ErrorResponse('User already exists', 400);

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
        firstName,
        lastName,
        email,
        password: hashedPassword,
    });

    const token = jwt.sign({ id: User._id }, secret, { expiresIn: '3d' });

    const isProduction = process.env.NODE_ENV == 'production';
    const cookieOptions = {
        httpOnly: true,
        sameSite: isProduction ? 'None' : 'Lax',
        secure: isProduction,
    };

    res.cookie('token', token, cookieOptions);
    res.status(201).json({
        success: `Welcome aboard, ${newUser.firstName} ${newUser.lastName}`,
    });
}

export async function signin(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) throw new ErrorResponse('User not found', 404);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) throw new ErrorResponse('Unauthorized', 401);

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '3d' });

    // console.log(token);

    const isProduction = process.env.NODE_ENV == 'production';
    const cookieOptions = {
        httpOnly: true,
        sameSite: isProduction ? 'None' : 'Lax',
        secure: isProduction,
    };

    res.cookie('token', token, cookieOptions);
    res.status(201).json({
        success: `Welcome back, ${user.firstName} ${user.lastName}`,
    });
}

export async function signout(req, res) {
    const cookieOptions = {
        httpOnly: true,
        sameSite: isProduction ? 'None' : 'Lax',
        secure: isProduction,
    };

    res.clearCookie('token', cookieOptions);
    res.status(200).json({ message: 'Until next time!' });
}
