import { Response, Request, NextFunction } from "express";
import User, { IUser } from "../../models/User";

export const register = async (req:Request, res:Response, next:NextFunction) => {
    const { username, email, password } = req.body;
    try {
        const user:IUser = await User.create({
            username,
            email,
            password
        });
        return res.status(201).send({msg: "User created" })
    } catch (error) {
        next(error);
    }
};

// TODO: Add session storage with tokens
export const login =async (req:Request, res:Response, next:NextFunction) => {
    const { username, email, password } = req.body;
    try {
        const user:IUser | null = await User.findOne({$or: [{email},{username}]}).select('+password');
        if (!user) {
            return res.status(401).send({msg: 'Invalid username.'});
        }

        const isMatch:boolean = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).send({msg: 'Invalid password.'});
        }

        return res.status(200).send({_id: user._id});
    } catch (error) {
        next(error);
    }
}