import express from "express"
import cloudinary from "../core/cloudinary";
import { IUserModel, UserModel } from "../models/UserModel";



class UploadFileController {

    async upload(req: express.Request, res: express.Response) {
        try {
            const file = req.file as Express.Multer.File
            if (!file) return res.status(400).send()

            cloudinary.v2.uploader.upload_stream({ resourse_type: `auto` }, (err, result) => {
                if (err || !result) return res.status(500).send()

                res.status(201).json({
                    url: result.url,
                    size: Math.round(result.bytes / 1024),
                    width: result.width,
                    height: result.height

                })

            }).end(file.buffer)

        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }



    async uploadAvatar(req: express.Request, res: express.Response) {
        try {
            const file = req.file as Express.Multer.File
            if (!file) return res.status(400).send()

            const user = req.user as IUserModel
            const userDb = await UserModel.findById(user._id)
            if (!user) return res.status(400).send()
            if (!userDb) return res.status(400).send()

            cloudinary.v2.uploader.upload_stream({ resourse_type: `auto` }, async (err, result) => {
                if (err || !result) return res.status(500).send()

                const url = result.url
                await userDb.updateOne({ avatarUrl: url }, { new: true })
                await user.save()

                return res.json({
                    url: result.url,
                    size: Math.round(result.bytes / 1024),
                    width: result.width,
                    height: result.height
                })

            }).end(file.buffer)

        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }


}

export default new UploadFileController()
