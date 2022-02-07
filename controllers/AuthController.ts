import express from "express"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import { IUserModel, UserModel } from "../models/UserModel"
import { generateMD5 } from "../utils/generateHash"
import { sendActivationLink } from "../utils/emailService"
import { isValidObjectId } from "mongoose"
import bcrypt from "bcryptjs"


class AuthController {


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
                res.redirect("http://localhost:3000/home")
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
                res.status(400).json({ message: 'Пользователь с таким email уже существует' })
                return
            }

            const hashedPassword = generateMD5(password + "s3cr3t")
            const confirmHash = generateMD5(Math.random().toString())
            const user = await UserModel.create(
                { email, fullName, username, password: hashedPassword, confirmHash }
            )
            await sendActivationLink(email, `http://localhost:8888/auth/verify/${confirmHash}`)
            res.status(201).json({ status: "success", data: user })


        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }



    async afterLogin(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as IUserModel

            if (user) {
                res.json({
                    status: "success",
                    data: {
                        user: user,
                        token: jwt.sign({ data: req.user }, "s3cr3t", { expiresIn: "30d" })
                    }
                })
                return
            }

            res.status(400).send()
        } catch (err) {
            res.status(500).json({ status: 'error', message: "fffa" })
        }
    }


    async getUserInfo(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user
            if (user) {
                res.json({
                    status: "success",
                    data: user
                })
                return
            }

            res.status(404).json("User not found")

        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }
}

export default new AuthController()