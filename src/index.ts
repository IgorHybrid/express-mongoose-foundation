import express from 'express';
import { json } from 'body-parser';
import { connectDB } from './config/db';
import routes from './routes';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(json());

app.use('/', routes);

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