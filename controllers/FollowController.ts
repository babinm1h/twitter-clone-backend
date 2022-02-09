import express from "express"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import { IUserModel, UserModel } from "../models/UserModel"
import { generateMD5 } from "../utils/generateHash"
import { sendActivationLink } from "../utils/emailService"
import { isValidObjectId } from "mongoose"
import bcrypt from "bcryptjs"


class FollowController {


    async follow(req: express.Request, res: express.Response) {
        try {
            const authId = (req.user as IUserModel)._id
            if (!authId) return res.status(400).send()

            const authUser = await UserModel.findById(authId)
            if (!authUser) return res.status(400).send()

            const user = await UserModel.findByIdAndUpdate(req.params.id,
                { $push: { followers: authId } }, { new: true })
            if (!user) return res.status(400).send()
            await user.save()

            await authUser.updateOne({ $push: { following: req.params.id } }, { new: true })
            await authUser.save()

            return res.json({ status: "success", data: req.params.id })

        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }


    async unfollow(req: express.Request, res: express.Response) {
        try {
            const authId = (req.user as IUserModel)._id
            if (!authId) return res.status(400).send()

            const authUser = await UserModel.findById(authId)
            if (!authUser) return res.status(400).send()

            const user = await UserModel.findByIdAndUpdate(req.params.id,
                { $pull: { followers: authId } }, { new: true })
            if (!user) return res.status(400).send()
            await user.save()

            await authUser.updateOne({ $pull: { following: req.params.id } }, { new: true })
            await authUser.save()

            return res.json({ status: "success", data: req.params.id })

        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }


}

export default new FollowController()