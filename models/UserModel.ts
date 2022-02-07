import mongoose, { ObjectId, Schema, Types } from "mongoose";
import { transform } from "typescript";


export interface IUserModel extends mongoose.Document {
    _id?: Types.ObjectId,
    email: string
    fullName: string
    username: string
    location: string
    password: string
    confirmed: boolean
    confirmHash: string
    about: string
    website: string
    tweets: string[]
    likes?: string[]
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
    website: String,
    tweets: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "Tweet" }]
}, {
    timestamps: true
})


export const UserModel = mongoose.model<IUserModel>("User", UserSchema)