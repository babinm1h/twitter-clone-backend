import express from "express"
import { validationResult } from "express-validator"
import { UserModel } from "../models/UserModel"
import { generateMD5 } from "../utils/generateHash"
import { sendActivationLink } from "../utils/emailService"


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


    async verify(req: express.Request, res: express.Response): Promise<void> {
        try {
            const hash = req.query.hash
            if (!hash) {
                res.status(400).json()
                return
            }



        } catch (err) {
            res.status(400).json({
                status: 'error',
                message: JSON.stringify(err)
            })
        }
    }


    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).json({ status: "error", errors: errors.array() })
                return
            }

            const { email, fullName, username, password } = req.body
            const condidate = await UserModel.findOne({ email })
            if (condidate) {
                res.json({ message: 'Пользователь с таким email уже существует' })
                return
            }

            const confirmHash = generateMD5(Math.random().toString())
            const user = await UserModel.create(
                { email, fullName, username, password, confirmHash }
            )
            await sendActivationLink(email, confirmHash)
            res.json({ status: "success", data: user })


        } catch (err) {
            res.status(400).json({
                status: 'error',
                message: err
            })
        }
    }





}

export default new UserController()