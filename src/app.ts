import 'dotenv/config';
import express from 'express';
import passport from 'passport';
import { json } from 'body-parser';
import routes from './routes';
import morgan from './utils/logger/morgan';
import { error404Handler, errorHandler, authMiddleware } from './middleware';

const app = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(json());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', authMiddleware.jwtStrategy);

app.use('/', routes);

// Error middleware
app.use(error404Handler);
app.use(errorHandler);

export default app;