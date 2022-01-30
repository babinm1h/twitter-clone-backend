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


    async verify(req: express.Request, res: express.Response): Promise<void> {
        try {
            const hash = req.params.hash
            if (!hash) {
                res.status(400).json("no hash")
                return
            }

            const user = await UserModel.findOne({ confirmHash: hash })
            if (!user) {
                res.status(400).json({ status: "error", message: "Пользователь не найден" })
            } else {
                user.confirmed = true
                await user.save()
                res.json({ status: "success" })
            }


        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
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

            const hashedPassword = await bcrypt.hash(password, 7)
            const confirmHash = generateMD5(Math.random().toString())
            const user = await UserModel.create(
                { email, fullName, username, password: hashedPassword, confirmHash }
            )
            await sendActivationLink(email, `http://localhost:8888/users/verify/${confirmHash}`)
            res.json({ status: "success", data: user })


        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }





}

export default new UserController()