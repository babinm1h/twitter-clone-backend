import express from "express"
import UsersController from "../controllers/UsersController"

export const usersRouter = express.Router()


usersRouter.get("/", UsersController.getAll)
usersRouter.get("/:id", UsersController.show)