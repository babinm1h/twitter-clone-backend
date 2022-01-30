import express from "express"
import UsersController from "../controllers/UsersController"

export const usersRouter = express.Router()


usersRouter.post("/", UsersController.create)
usersRouter.get("/", UsersController.getAll)
usersRouter.get("/verify/:hash", UsersController.verify)
usersRouter.get("/:id", UsersController.show)