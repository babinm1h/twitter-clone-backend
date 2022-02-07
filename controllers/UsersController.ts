import express from "express"
import { validationResult } from "express-validator"
import { UserModel } from "../models/UserModel"
import { generateMD5 } from "../utils/generateHash"
import { sendActivationLink } from "../utils/emailService"
import { isValidObjectId } from "mongoose"
import bcrypt from "bcryptjs"


class UserController {

    async getAll(req: express.Request, res: express.Response): Promise<void> {
        try {
            const users = await UserModel.find()
            res.json({
                status: "success",
                data: users,
            })
        } catch (err) {
            res.status(400).json({
                status: 'error',
                message: err
            })
        }
    }


    async show(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userId = req.params.id
            if (!isValidObjectId(userId)) {
                res.status(404).json("Пользователь не найден")
                return
            }
            const user = await UserModel.findById(userId)
            res.json({ status: "success", data: user })


        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }

    }





}

export default new UserController()