import mongoose from "mongoose";


export interface IUserModel extends mongoose.Document {
    email: string
    fullName: string
    username: string
    location: string
    password: string
    confirmed: boolean
    confirmHash: string
    about: string
    website: string
}

const UserSchema = new mongoose.Schema<IUserModel>({
    email: { unique: true, type: String, required: true },
    fullName: { type: String, required: true },
    username: { type: String, required: true },
    location: String,
    password: { type: String, required: true },
    confirmed: { type: Boolean, default: false },
    confirmHash: { type: String, required: true },
    about: String,
    website: String
})

export const UserModel = mongoose.model<IUserModel>("User", UserSchema)