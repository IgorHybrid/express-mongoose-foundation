import express from 'express';
import { json } from 'body-parser';
import { connectDB } from './config/db';
import routes from './routes';
import morgan from './utils/logger/morgan';
import { error404Handler, errorHandler } from './middleware';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(json());

app.use('/', routes);

// Error middleware
app.use(error404Handler);
app.use(errorHandler);

(async () => {
    try {
        await connectDB();
        app.listen(
            PORT, () => {
                console.log(`Server is running on port ${PORT}`);
            }
        )
    } catch (error) {
        console.error(error);
    }
})();