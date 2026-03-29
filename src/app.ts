import express from 'express';
import cookieParser from 'cookie-parser';
import router from './routes/index';
import handleError from './middlewares/handleError';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(router);
app.use(handleError);

export default app;
