import bycrypt from "bcryptjs";
import { model, Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
    matchPassword(password:string): boolean | PromiseLike<boolean>,
    toJSON(): INewUser,
    username: string,
    password: string,
    email: string
};

export interface IUserModel extends Model<IUser> {
    isEmailValid(email:string): boolean | PromiseLike<boolean>,
    isUsernameValid(username:string): boolean | PromiseLike<boolean>
};

export type INewUser = Omit<IUser, 'password'>

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

UserSchema.statics.isEmailValid = async function(email:string) {
    const userDoc = await this.findOne({email});

    return !!userDoc;
};

UserSchema.statics.isUsernameValid = async function(username:string) {
    const userDoc = await this.findOne({username});

    return !!userDoc;
};

UserSchema.methods.matchPassword = async function(password:string) {
    return await bycrypt.compare(password, this.password);
};

UserSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;

    return user;
}

export const User = model<IUser, IUserModel>("User", UserSchema);