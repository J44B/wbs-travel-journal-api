import { Router } from 'express';
import validateJOI from '../middlewares/validateJOI.js';
import { createUser, getSingleUser } from '../controllers/users.js';
import { userSchema, singinSchema } from '../joi/schemas.js';

const authRouter = Router();

// Return JWT
authRouter.route('/signup').post(validateJOI(userSchema), createUser);

// Verify credentials
// Return JWT
authRouter.route('/signin/:id').post(validateJOI(singinSchema), getSingleUser);

// receive a request with a token and return associated user data
authRouter.route('/me/:id').get(getSingleUser);

export default authRouter;
