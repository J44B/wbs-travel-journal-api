import './db/index.js';
import express from 'express';
import cors from 'cors';
import postsRouter from './routes/postsRouter.js';
import usersRouter from './routes/usersRouter.js';
import authRouter from './routes/authRouter.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors({ origin: '*' }));
app.use(express.json());
app.use('/posts', postsRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/*wildcard', (req, res) =>
    res.status(404).json({ error: 'Not found' })
);
app.use(errorHandler);

app.listen(port, () =>
    console.log(`Server listening on port : http://localhost:${port}`)
);
