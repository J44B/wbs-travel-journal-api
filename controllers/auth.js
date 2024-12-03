import { isValidObjectId } from 'mongoose';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

const salt = 10;
const secret = process.env.SECRET;
