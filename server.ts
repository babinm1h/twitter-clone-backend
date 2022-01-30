import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import UsersController from "./controllers/UsersController";
import { registrationValid } from "./validations/registration";
dotenv.config()


const PORT = process.env.PORT || 8888
const app = express()


app.use(express.json())



// =============== users
app.get("/users", UsersController.getAll)
app.post("/users", registrationValid, UsersController.create)







const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL!)
        app.listen(PORT, () => console.log("started", PORT))
    } catch (e: any) {
        throw new Error(e)
    }
}
start()


