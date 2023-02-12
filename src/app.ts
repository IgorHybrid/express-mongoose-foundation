import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import { json } from 'body-parser';
import routes from './routes';
import morgan from './utils/logger/morgan';
import { errorMiddleware, authMiddleware } from './middleware';

const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(json());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', authMiddleware.jwtStrategy);

app.use('/', routes);

// Error middleware
app.use(errorMiddleware.error404Handler);
app.use(errorMiddleware.errorConverter);
app.use(errorMiddleware.errorHandler);

export default app;