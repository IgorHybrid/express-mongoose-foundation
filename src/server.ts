import app from './app';
import { connectDB } from './config/db';
const PORT = process.env.PORT || 5000;

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