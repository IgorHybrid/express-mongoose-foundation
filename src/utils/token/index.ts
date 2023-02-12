import jwt from 'jsonwebtoken';
import moment, { Moment } from 'moment';
import mongoose from 'mongoose';
import { IToken, AccessAndRefreshToken ,Token } from '../../models/Token';
import ApiError from '../error';

export const generateToken = (
    userID: mongoose.Types.ObjectId,
    expires: Moment,
    type: string,
    secret: string = process.env.JWT_SECRET || 'json-secret'
):string => {
    const payload = {
        sub: userID,
        iat: moment().unix(),
        exp: expires.unix(),
        type
    };

    return jwt.sign(payload, secret);
};

export const saveToken = async (
    token: string,
    userID: mongoose.Types.ObjectId,
    expires: Moment,
    type: string,
    blacklisted: boolean = false
): Promise<IToken> => {
    const tokenDoc = await Token.create({
        token,
        user: userID,
        expires: expires.toDate(),
        type,
        blacklisted
    });

    return tokenDoc;
};

export const generateAuthToken = async (
    userID: mongoose.Types.ObjectId
):Promise<AccessAndRefreshToken> => {
    const accessTokenExpires = moment().add(process.env.JWT_ACCESS_EXPIRATION_MINUTES, 'minutes');
    const accessToken = generateToken(userID, accessTokenExpires, 'access');

    const refreshTokenExpires = moment().add(process.env.JWT_REFRESH_EXPIRATION_DAYS, 'days');
    const refreshToken = generateToken(userID, refreshTokenExpires, 'refresh');
    await saveToken(refreshToken, userID, refreshTokenExpires, 'refresh');

    return {
        access: {
            token: accessToken,
            expires: accessTokenExpires.toDate()
        },
        refresh: {
            token: refreshToken,
            expires: refreshTokenExpires.toDate()
        }
    }
}

export const verifyToken = async (
    token: string,
    type: string
): Promise<IToken> => {
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET || 'json-secret');
        if (typeof payload.sub !== 'string') {
            throw new Error('Incorrect user');
        }
        const tokenDoc = await Token.findOne({
           token,
           type,
           user: payload.sub,
           blacklisted: false
        });

        if (!tokenDoc) {
            throw new Error('Token not found');
        }
        return tokenDoc;
    } catch (error:any) {
        throw new ApiError(401, error.message);
    }
}