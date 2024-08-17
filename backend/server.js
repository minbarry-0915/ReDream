import express from 'express';
import bodyParser from 'body-parser';
import connection from './db.js'; // .js 확장자 명시
import cors from 'cors';
import userRouter from './routes/userRouter.js'; // .js 확장자 명시
import bookRouter from './routes/bookRouter.js'; // .js 확장자 명시
import genreRouter from './routes/genreRouter.js';
import keywordRouter from './routes/keywordRouter.js';
import dotenv from 'dotenv';

dotenv.config();


const app = express();
const port = process.env.BACKEND_PORT;

app.use(express.json());
app.use(cors());

app.use('/api', userRouter);
app.use('/api', bookRouter);
app.use('/api', genreRouter);
app.use('/api', keywordRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});