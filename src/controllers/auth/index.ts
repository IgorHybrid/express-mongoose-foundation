import { Response, Request, NextFunction } from "express";
import { Token } from "../../models/Token";
import { INewUser, IUser, User } from "../../models/User";
import { generateAuthToken, verifyToken } from "../../utils/token";
import ApiError from "../../utils/error";

export const register = async (req:Request, res:Response, next:NextFunction) => {
    const { username, email, password } = req.body;
    try {
        if (await User.isEmailValid(email)) {
            throw new ApiError(400, 'Email already taken');
        }

        if (await User.isUsernameValid(username)) {
            throw new ApiError(400, 'Username already taken');
        }

        const userDoc:IUser = await User.create({
            username,
            email,
            password
        });
        const tokens = await generateAuthToken(userDoc.id);
        const user:INewUser = userDoc.toJSON();
        return res.status(201).send({ user, tokens });
    } catch (error) {
        next(error);
    }
};

export const login = async (req:Request, res:Response, next:NextFunction) => {
    const { username, email, password } = req.body;
    try {
        const user:IUser | null = await User.findOne({$or: [{email},{username}]}).select('+password');
        if (!user) {
            throw new ApiError(401, 'Incorrect username/email');
        }

        const isMatch:boolean = await user.matchPassword(password);
        if (!isMatch) {
            throw new ApiError(401, 'Incorrect password');
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
            throw new ApiError(401, 'Invalid credentials');
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
            throw new ApiError(401, 'User not found');
        }

        await refreshTokenDoc.remove();
        const tokens = await generateAuthToken(user.id);
        return res.send({user, tokens});
    } catch (error) {
        next(error)
    }
}