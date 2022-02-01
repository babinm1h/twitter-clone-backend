import express from "express"
import TweetsController from "../controllers/TweetsController"
import { tweetsValidation } from "../validations/tweets"


export const tweetsRouter = express.Router()


tweetsRouter.get("/", TweetsController.getAll)
tweetsRouter.post("/", tweetsValidation, TweetsController.create)
tweetsRouter.get("/:id", TweetsController.show)
tweetsRouter.delete("/:id", TweetsController.delete)