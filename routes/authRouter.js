import { Router } from 'express';
import validateJOI from '../middlewares/validateJOI.js';
import { userSchema, signinSchema } from '../joi/schemas.js';
import { me, signin, signup, signout } from '../controllers/auth.js';
import { verifyToken } from '../middlewares/verifyToken.js';

const authRouter = Router();

// signup
// Create user
// Return JWT
authRouter.post('/signup', validateJOI(userSchema), signup);

// signin
// Verify credentials
// Return JWT
authRouter.post('/signin', validateJOI(signinSchema), signin);

// receive a request with a token and return associated user data
authRouter.get('/me', verifyToken, me);

authRouter.delete('/signout', signout);

export default authRouter;
