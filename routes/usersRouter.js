import { Router } from 'express';
import validateJOI from '../middlewares/validateJOI.js';
import {
    getAllUsers,
    getSingleUser,
    updateUser,
    deleteUser,
} from '../controllers/users.js';
import { userSchema } from '../joi/schemas.js';

const usersRouter = Router();

usersRouter.route('/').get(getAllUsers);

usersRouter
    .route('/:id')
    .get(getSingleUser)
    .put(validateJOI(userSchema), updateUser)
    .delete(deleteUser);

export default usersRouter;
