import express from "express"
import TweetsController from "../controllers/TweetsController"
import { passport } from "../core/passport"
import { tweetsValidation } from "../validations/tweets"


export const tweetsRouter = express.Router()


tweetsRouter.get("/", TweetsController.getAll)
tweetsRouter.post("/", passport.authenticate("jwt"), tweetsValidation, TweetsController.create)
tweetsRouter.get("/:id", TweetsController.show)
tweetsRouter.delete("/:id", passport.authenticate("jwt"), TweetsController.delete)
tweetsRouter.patch("/:id", passport.authenticate("jwt"), tweetsValidation, TweetsController.update)
tweetsRouter.get("/user/:id", TweetsController.getUserTweets)

tweetsRouter.post("/like/:id", passport.authenticate("jwt"), TweetsController.like)
tweetsRouter.delete("/unlike/:id", passport.authenticate("jwt"), TweetsController.unlike)