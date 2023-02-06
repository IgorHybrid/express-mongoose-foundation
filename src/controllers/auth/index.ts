import { Response, Request, NextFunction } from "express";
import { Token } from "../../models/Token";
import { IUser, User } from "../../models/User";
import { generateAuthToken, verifyToken } from "../../utils/token";

export const register = async (req:Request, res:Response, next:NextFunction) => {
    const { username, email, password } = req.body;
    try {
        const user:IUser = await User.create({
            username,
            email,
            password
        });
        const tokens = await generateAuthToken(user.id);
        return res.status(201).send({user, tokens });
    } catch (error) {
        next(error);
    }
};

export const login = async (req:Request, res:Response, next:NextFunction) => {
    const { username, email, password } = req.body;
    try {
        const user:IUser | null = await User.findOne({$or: [{email},{username}]}).select('+password');
        if (!user) {
            return next({name: 'ValidationError', message: 'Invalid username.'});
        }

        const isMatch:boolean = await user.matchPassword(password);
        if (!isMatch) {
            return next({name: 'ValidationError', message: 'Invalid password.'});
        }

        const tokens = await generateAuthToken(user.id)
        return res.status(200).send({user, tokens});
    } catch (error) {
        next(error);
    }
};

export const logout = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const refreshTokenDoc = await Token.findOne({token: req.body.refreshToken, type: 'refresh', blacklisted: false});
        if (!refreshTokenDoc) {
            throw new Error('Not Found');
        }

        await refreshTokenDoc.remove();
        return res.status(204).send();
    } catch (error) {
        next(error)
    }
};

export const refreshToken = async (req:Request, res:Response, next:NextFunction) => {
    try {
        const refreshTokenDoc = await verifyToken(req.body.refreshToken, 'refresh');
        const user = await User.findById(refreshTokenDoc.user);
        if (!user) {
            throw new Error('User not found');
        }

        await refreshTokenDoc.remove();
        const tokens = await generateAuthToken(user.id);
        return res.send({user, tokens});
    } catch (error) {
        next(error)
    }
}