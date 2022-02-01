import mongoose, { ObjectId } from "mongoose";
import { IUserModel } from "./UserModel";


export interface ITweetModel extends mongoose.Document {
    _id?: string
    text: string
    user: ObjectId | string
}

const TweetSchema = new mongoose.Schema<ITweetModel>({
    text: { type: String, required: true, maxlength: 280 },
    user: { required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" }
})


export const TweetModel = mongoose.model<ITweetModel>("Tweet", TweetSchema)