import express from "express";
import AuthController from "../controllers/AuthController";
import { passport } from "../core/passport";


export const authRouter = express.Router()




authRouter.get("/verify/:hash", AuthController.verify)

authRouter.post("/registr", AuthController.create)

authRouter.post("/login", passport.authenticate('local'), AuthController.afterLogin)

authRouter.get("/me", passport.authenticate("jwt", { session: false }), AuthController.getUserInfo)