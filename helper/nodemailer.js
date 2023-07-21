import nodemailer from "nodemailer"

export const transporter = nodemailer.createTransport({
    service: process.env.SMPT_SERVICE,
    auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASS
    },
})  