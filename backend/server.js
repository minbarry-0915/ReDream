import express from 'express';
import bodyParser from 'body-parser';
import connection from './db.js'; // .js 확장자 명시
import cors from 'cors';
import registerRouter from './routes/register.js'; // .js 확장자 명시
import loginRouter from './routes/login.js'; // .js 확장자 명시
import bookRouter from './routes/bookRouter.js'; // .js 확장자 명시

const app = express();
const port = 3000;


app.use(express.json());
app.use(cors());

app.use('/api', registerRouter);
app.use('/api', loginRouter);
app.use('/api', bookRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});