import connectToDB from "@/helper/connectToDB"
import User from "@/models/user"
import bcrypt from "bcrypt"
import { withSessionRoute } from "@/helper/iron"

export default withSessionRoute(async function (req, res) {
    await connectToDB()

    if (req.method == "POST") {
        try {
            const user = await User.findOne({ email: req.body.email })

            if (!user) {
                return res.status(401).json({
                    message: "Unvalid user credentials.",
                    success: false
                })
            }

            const match = await bcrypt.compare(req.body.password, user.password)

            if (!match) {
                return res.status(401).json({
                    message: "Unvalid user credentials.",
                    success: false
                })
            }

            req.session.user = {
                id: user._id
            }

            await req.session.save()

            return res.status(200).json({
                message: "You logged in successfully.",
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