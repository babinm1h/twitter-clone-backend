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
    avatarUrl: string
    followers: string[]
    following: string[]
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
    likes: [{ type: Schema.Types.ObjectId, ref: "Tweet" }],
    avatarUrl: { type: String, default: "https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png" },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, {
    timestamps: true
})


export const UserModel = mongoose.model<IUserModel>("User", UserSchema)