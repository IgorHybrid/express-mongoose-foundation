import { Response, Request } from "express";
import User, { IUser } from "../../models/User";

export const register = async (req:Request, res:Response, next:any) => {
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
};