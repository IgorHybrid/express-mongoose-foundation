import { model, Schema, Document } from "mongoose";
import { JwtPayload } from "jsonwebtoken";

export interface IToken extends Document {
    token: string;
    user: string;
    type: string;
    expires: Date;
    blacklisted: boolean;
}

export interface IPayload extends JwtPayload {
    sub: string;
    iat: number;
    exp: number;
    type: string;
  }

export interface AccessAndRefreshToken {
    access: {
        token: string,
        expires: Date
    },
    refresh: {
        token: string,
        expires: Date
    }
}

const tokenSchema:Schema = new Schema<IToken>(
    {
        token: {
            type: String,
            required: true,
            index: true
        },
        user: {
            type: String,
            ref: 'User',
            required: true
        },
        type: {
            type: String,
            enum: ['refresh', 'resetPassword', 'verifyEmail'],
            required: true
        },
        expires: {
            type: Date,
            required: true
        },
        blacklisted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

export const Token = model<IToken>('Token', tokenSchema);