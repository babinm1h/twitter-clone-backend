import express from "express";
import cors from "cors"
import mongoose from "mongoose";
import dotenv from "dotenv";
import UsersController from "./controllers/UsersController";
import { registrationValid } from "./validations/registration";
import { usersRouter } from "./routers/users";
import { authRouter } from "./routers/auth";
import { tweetsRouter } from "./routers/tweets";
import cookieParser from "cookie-parser"
import { passport } from "./core/passport";
import { uploadRouter } from "./routers/upload";

dotenv.config()


const PORT = process.env.PORT || 8888
const app = express()


app.use(express.json())
app.use(passport.initialize())
app.use(cors({ origin: "http://localhost:3000", credentials: true }))
app.use("/users", usersRouter)
app.use("/auth", authRouter)
app.use("/tweets", tweetsRouter)
app.use("/upload", uploadRouter)




const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL!)
        app.listen(PORT, () => console.log("started", PORT))
    } catch (e: any) {
        throw new Error(e)
    }
}
start()


