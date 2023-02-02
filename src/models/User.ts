import { model, Schema, Model, Document } from "mongoose";

export interface IUser extends Document {
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

export default model<IUser>("User", UserSchema);