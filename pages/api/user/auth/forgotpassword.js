import connectToDB from "@/helper/connectToDB"
import { withSessionRoute } from "@/helper/iron"
import { transporter } from "@/helper/nodemailer"
import User from "@/models/user"
import bcrypt from "bcrypt"

export default withSessionRoute(async function (req, res) {
    await connectToDB()

    if (req.method == "POST") {
        try {
            const OTP = Math.floor(Math.random() * 1000000).toString().padStart(6, "0")
            const otptimestamp = Date.now()

            const hashedOTP = await bcrypt.hash(OTP, 10)

            const response = await User.findOneAndUpdate({ email: req.body.email }, { otp: hashedOTP, otptimestamp: otptimestamp })

            if (!response) {
                return res.status(404).json({
                    message: "This email does not exists.",
                    success: false
                })
            }

            await transporter.sendMail({
                from: process.env.SMPT_MAIL,
                to: req.body.email,
                subject: "Authentication Password Recovery Request.",
                html: `<h1>${OTP}</h1>`
            })

            req.session.user = {
                id: response._id
            }

            await req.session.save()

            return res.status(200).json({
                message: `OTP sent successfully on ${req.body.email}`,
                success: true
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error.",
                err: error.message,
                success: false
            })
        }
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
})