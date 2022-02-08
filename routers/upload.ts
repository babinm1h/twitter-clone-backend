import express from "express";
import multer from "multer";
import path from "path";
import UploadFilesController from "../controllers/UploadFilesController";
import { passport } from "../core/passport";


export const uploadRouter = express.Router()


const storage = multer.memoryStorage()

const types = ["image/png", "image/jpg", "image/jpeg"]

export const fileFilter = (req: express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    if (types.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(null, false)
    }
}

const upload = multer({ storage, fileFilter })


//////////////////////
uploadRouter.post("/", upload.single("image"), UploadFilesController.upload)

uploadRouter.post("/ava", passport.authenticate("jwt"), upload.single("avatar"), UploadFilesController.uploadAvatar)




