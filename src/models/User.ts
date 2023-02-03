import bycrypt from "bcryptjs";
import { model, Schema, Document } from "mongoose";

export interface IUser extends Document {
    matchPassword(password:string): boolean | PromiseLike<boolean>,
    username: string,
    password: string,
    email: string
};

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Cannot be blank"],
        index: true
    },
    password: {
        type: String,
        required: true,
        select: false,
        minlength: [8, "Please use minimum of 8 characters"],
    },
    email: {
        type: String,
        lowercase: true,
        required: [true, "Can't be blank"],
        match: [/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please use a valid address'],
        unique: true,
        index: true
    },
});

UserSchema.pre<IUser>("save", async function (next: any) {
    if (this.isModified("password")) {
        this.password = bycrypt.hashSync(this.password, 10);
    }
    next();
});

UserSchema.methods.matchPassword = async function(password:string) {
    return await bycrypt.compare(password, this.password);
};

export const User = model<IUser>("User", UserSchema);