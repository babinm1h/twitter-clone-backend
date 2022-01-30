import { body } from "express-validator";


export const registrationValid = [
    body("email", "Введите email").isEmail().withMessage("Неправильный email")
        .isLength({ min: 5, max: 44 }).withMessage("Допустимая длина email от 5 до 44 символов"),

    body("fullName", "Введите имя").isString().isLength({ min: 2, max: 44 })
        .withMessage("Допустимая длина имени от 2 до 44 символов"),

    body("username", "Введите логин").isString().isLength({ min: 2, max: 44 })
        .withMessage("Допустимая длина логина от 2 до 44 символов"),

    body("password", "Введите пароль").isString().isLength({ min: 6, max: 34 })
        .withMessage("Допустимая длина пароля от 6 до 34 символов")
]