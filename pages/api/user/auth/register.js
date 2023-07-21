import connectToDB from "@/helper/connectToDB"
import User from "@/models/user"
import bcrypt from 'bcrypt'
import { withSessionRoute } from "@/helper/iron"

export default withSessionRoute(async function (req, res) {
    await connectToDB()

    if (req.method == "POST") {
        try {
            const email = await User.exists({ email: req.body.email })

            if (email) {
                return res.status(409).json({
                    message: "This email is already taken.",
                    success: false
                })
            }

            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            const user = {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
                picture: req.body.picturename
            }

            const response = await User.create(user)

            req.session.user = {
                id: response._id
            }

            await req.session.save()

            return res.status(200).json({
                message: "Your account has been created.",
                success: true
            })
        } catch (error) {
            return res.status(500).json({
                message: "Internal server error.",
                err: error,
                success: false
            })
        }
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
})