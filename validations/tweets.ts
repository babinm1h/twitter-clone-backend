import { body } from "express-validator";


export const tweetsValidation = [
    body("text", "Введите текст").isString().isLength({ min: 1, max: 280 })
        .withMessage("Максимальная длина 280 символов")
]