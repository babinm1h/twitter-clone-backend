import nodemailer from "nodemailer"



const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.mail.ru",
    port: 465,
    auth: {
        user: process.env.SMTP_USER || "csgoacc0@mail.ru",
        pass: process.env.SMTP_PASS || "P5ap1RaSQRC451XCLJ4B"
    }
});


export const sendActivationLink = async (to: string, link: string) => {
    await transport.sendMail({
        from: process.env.SMTP_USER || "csgoacc0@mail.ru",
        to,
        subject: "Активация аккаунта TwitteRRR",
        text: "",
        html: `
        <h1>Перейдите по ссылке чтобы подтвердить аккаунт</h1>
        <div><a href=${link}>${link}</a></div>
        `
    })
}


