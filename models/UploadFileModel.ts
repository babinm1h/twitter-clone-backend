import mongoose, { ObjectId, Types } from "mongoose";
import { IUserModel } from "./UserModel";


export interface IUploadFileModel extends mongoose.Document {
    filename: string
    size: number
    ext: string
    url: string
    message: string
    user: IUserModel | ObjectId
}

const UploadFileSchema = new mongoose.Schema<IUploadFileModel>({
    filename: String,
    size: Number,
    ext: String,
    url: String,
    message: String,
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
}, {
    timestamps: true
})


export const UploadFileModel = mongoose.model<IUploadFileModel>("UploadFile", UploadFileSchema)