import express from "express";
import ProfileController from "../controllers/ProfileController";
import { passport } from "../core/passport";


export const profileRouter = express.Router()


profileRouter.patch("/about", passport.authenticate("jwt"), ProfileController.setAbout)
