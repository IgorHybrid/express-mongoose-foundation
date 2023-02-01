import express from 'express';
import { connectDB } from './config/db';

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/",(req, res) => {
    res.send('Hello World!');
});

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