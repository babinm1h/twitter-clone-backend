import express from "express"
import cloudinary from "../core/cloudinary";



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



}

export default new UploadFileController()

// const item = files.map((f: Express.Multer.File) => new Promise((resolve) => {
//     cloudinary.v2.uploader.upload_stream({ resourse_type: `auto` }, (error, result) => {
//         if (error || !result) {
//             return res.status(500).json({ status: "error", message: "upload err" + error })
//         }

//         return res.status(201).json({
//             url: result.url,
//             size: Math.round(result.bytes / 1024),
//             width: result.width,
//             height: result.height
//         })
//     }).end(f.buffer)
// }))