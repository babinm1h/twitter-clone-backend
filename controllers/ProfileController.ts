import express from "express"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import { IUserModel, UserModel } from "../models/UserModel"
import { generateMD5 } from "../utils/generateHash"
import { sendActivationLink } from "../utils/emailService"
import { isValidObjectId } from "mongoose"
import bcrypt from "bcryptjs"


class ProfileController {


    async setAbout(req: express.Request, res: express.Response) {
        try {
            const user = req.user as IUserModel
            if (!user) return res.status(400).send()

            const userDb = await UserModel.findById(user._id)
            if (!userDb) return res.status(400).send()

            await userDb.updateOne({ about: req.body.about }, { new: true })
            await userDb.save()

            return res.json({ status: "succes", data: userDb })

        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }



}

export default new ProfileController()