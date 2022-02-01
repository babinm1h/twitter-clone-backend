import express from "express"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import { IUserModel, UserModel } from "../models/UserModel"
import { generateMD5 } from "../utils/generateHash"
import { sendActivationLink } from "../utils/emailService"
import { isValidObjectId, ObjectId } from "mongoose"
import bcrypt from "bcryptjs"
import { ITweetModel, TweetModel } from "../models/TweetModel"


class TweetsController {

    async getAll(req: express.Request, res: express.Response): Promise<void> {
        try {
            const tweets = await TweetModel.find()
            res.json({
                status: "success",
                data: tweets
            })


        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }



    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            

        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }


    async show(req: express.Request, res: express.Response): Promise<void> {
        try {
            const tweetId = req.params.id
            if (!isValidObjectId(tweetId)) {
                res.status(400).json("wrong id")
            }

            const tweet = await TweetModel.findById(tweetId)
            if (!tweet) {
                res.status(400).json({ status: 'error' })
            }

            res.json({ status: "success", data: tweet })

        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }



    async delete(req: express.Request, res: express.Response): Promise<void> {
        try {
            

        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }



}

export default new TweetsController()