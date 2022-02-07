import mongoose, { ObjectId, Types } from "mongoose";
import { IUserModel } from "./UserModel";


export interface ITweetModel extends mongoose.Document {
    _id?: string
    text: string
    user: Types.ObjectId
    images?: string[]
    likes: Types.ObjectId[]
}

const TweetSchema = new mongoose.Schema<ITweetModel>({
    text: { type: String, required: true, maxlength: 280 },
    user: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" },
    images: [{ type: String }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, {
    timestamps: true
})


export const TweetModel = mongoose.model<ITweetModel>("Tweet", TweetSchema)