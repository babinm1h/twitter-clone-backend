import express from "express";
import FollowController from "../controllers/FollowController";
import { passport } from "../core/passport";


export const followRouter = express.Router()


followRouter.post("/:id", passport.authenticate("jwt"), FollowController.follow)
followRouter.delete("/:id", passport.authenticate("jwt"), FollowController.unfollow)