import express from 'express';
import { json } from 'body-parser';
import { connectDB } from './config/db';
import User, { IUser } from './modules/User';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(json());

app.get("/", async (req, res) => {
    res.send('Hello World!');
});

app.post("/auth/register", async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const user:IUser = await User.create({
            username,
            email,
            password
        });
        return res.status(201).send({msg: "User created" })
    } catch (error) {
        console.error(error);
    }
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