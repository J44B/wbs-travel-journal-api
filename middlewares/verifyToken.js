import jwt from 'jsonwebtoken';
import ErrorResponse from '../utils/ErrorResponse.js';

export function verifyToken(req, res, next) {
    const cookies =
        req.headers.cookie.split(';').map((cookie) => cookie.trim()) || [];

    const cookiesObj = cookies.reduce((acc, cookie) => {
        const [key, value] = cookie.split('=');
        acc[key] = value;
        return acc;
    }, {});

    console.log(cookiesObj);

    const token = cookiesObj.token;

    if (!token) throw new ErrorResponse('Unauthorized. Please sign in.', 400);

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.id;
    next();
}
