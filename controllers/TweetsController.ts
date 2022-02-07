import express from "express"
import jwt from "jsonwebtoken"
import { validationResult } from "express-validator"
import { IUserModel, UserModel } from "../models/UserModel"
import { generateMD5 } from "../utils/generateHash"
import { sendActivationLink } from "../utils/emailService"
import { isValidObjectId, ObjectId, Types } from "mongoose"
import bcrypt from "bcryptjs"
import { ITweetModel, TweetModel } from "../models/TweetModel"


class TweetsController {

    async getAll(req: express.Request, res: express.Response): Promise<void> {
        try {
            const tweets = await TweetModel.find().populate("user").sort({ "createdAt": "-1" })
            res.json({
                status: "success",
                data: tweets
            })
            return
        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }



    async create(req: express.Request, res: express.Response) {
        try {
            const user = req.user as IUserModel
            if (user) {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    return res.status(400).json({ status: "error", errors: errors.array() })
                }

                const data: any = {
                    text: req.body.text,
                    images: req.body.images,
                    user: user._id as Types.ObjectId
                }

                const tweet = await TweetModel.create(data)
                if (user.tweets) {
                    user.tweets.push(tweet._id!)
                }

                return res.status(201).json({
                    status: "success",
                    data: await tweet.populate("user")
                })
            } else {
                return res.status(400).send()
            }

        } catch (err) {
            return res.status(500).json({ status: 'error', message: err })
        }
    }


    async show(req: express.Request, res: express.Response): Promise<void> {
        try {
            const tweetId = req.params.id
            if (!isValidObjectId(tweetId)) {
                res.status(400).json("wrong id")
                return
            }

            const tweet = await TweetModel.findById(tweetId).populate("user")
            if (!tweet) {
                res.status(400).json({ status: 'error' })
                return
            }

            res.json({ status: "success", data: tweet })

        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }



    async delete(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as any
            if (user) {
                const tweetId = req.params.id
                if (!isValidObjectId(tweetId)) {
                    res.status(400).json({ status: "error", message: "Tweet not found" })
                    return
                }

                const tweet = await TweetModel.findById(tweetId)
                if (tweet) {
                    if (tweet.user.equals(user._id)) {
                        await TweetModel.findByIdAndDelete(tweetId)
                        res.json({ status: "success", data: tweet })
                    } else {
                        res.status(400).json({ status: "error", message: "Tweet not found" })
                    }
                } else {
                    res.status(400).json({ status: "error", message: "Tweet not found" })
                }
            }

        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }



    async update(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as any
            if (user) {
                const tweetId = req.params.id
                if (!isValidObjectId(tweetId)) {
                    res.status(400).json({ status: "error", message: "Tweet not found" })
                    return
                }

                const tweet = await TweetModel.findById(tweetId)
                if (tweet) {
                    if (tweet.user.equals(user._id)) {
                        const text = req.body.text
                        tweet.text = text
                        await tweet.save()
                        res.json({ status: "success", data: tweet })
                    } else {
                        res.status(400).json({ status: "error", message: "Tweet not found" })
                    }
                } else {
                    res.status(400).json({ status: "error", message: "Tweet not found" })
                }
            }

        } catch (err) {
            res.status(500).json({ status: 'error', message: err })
        }
    }



    async getUserTweets(req: express.Request, res: express.Response) {
        try {
            const userId = req.params.id
            if (!isValidObjectId(userId)) {
                return res.status(400).json({ status: "error", message: "User not found" })
            }

            const tweets = await TweetModel.find({ user: userId }).populate("user").sort({ "createdAt": "-1" })
            if (!tweets) {
                return res.status(404).send()
            }

            res.json({
                status: 'success',
                data: tweets
            })

        } catch (err) {
            return res.status(500).json({ status: 'error', message: err })
        }
    }


    async like(req: express.Request, res: express.Response) {
        try {
            const user = req.user as IUserModel
            const tweetId = req.params.id
            const tweet = await TweetModel.findById(tweetId)

            const userDb = await UserModel.findById(user._id)
            if (tweet && user) {
                if (!tweet.likes.includes(user._id!)) {
                    await tweet.updateOne({ $push: { likes: user._id } }, { new: true })
                    await userDb!.updateOne({ $push: { likes: tweetId } }, { new: true })
                    await tweet.save()
                    return res.json({ status: "liked", data: tweet })
                }
            } else {
                res.status(400).json({ status: "error", data: "tweet doesnt exist" })
            }
            res.status(400).send()

        } catch (err) {
            return res.status(500).json({ status: 'error', message: err })
        }
    }

    async unlike(req: express.Request, res: express.Response) {
        try {
            const user = req.user as IUserModel
            const tweetId = req.params.id
            const tweet = await TweetModel.findById(tweetId)

            const userDb = await UserModel.findById(user._id)
            if (tweet && user) {
                if (tweet.likes.includes(user._id!)) {
                    await tweet.updateOne({ $pull: { likes: user._id } }, { new: true })
                    await userDb!.updateOne({ $pull: { likes: tweetId } }, { new: true })
                    await tweet.save()
                    return res.json({ status: "unliked", data: tweet })
                }
            } else {
                res.status(400).json({ status: "error", data: "tweet doesnt exist" })
            }
            res.status(400).send()

        } catch (err) {
            return res.status(500).json({ status: 'error', message: err })
        }
    }

}

export default new TweetsController()