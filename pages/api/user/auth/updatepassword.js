import connectToDB from "@/helper/connectToDB"
import { withSessionRoute } from "@/helper/iron"
import User from "@/models/user"
import bcrypt from "bcrypt"

export default withSessionRoute(async function (req, res) {
    await connectToDB()

    if (req.method == "POST") {
        try {
            try {
                const user = await User.findOne({ _id: req.session.user.id })

                if (!user) {
                    return res.status(401).json({
                        message: "The user is not exists.",
                        success: false
                    })
                }

                const match = await bcrypt.compare(req.body.oldPassword, user.password)

                if (!match) {
                    return res.status(401).json({
                        message: "Unvalid user credentials.",
                        success: false
                    })
                }

                const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);

                await User.findOneAndUpdate({ _id: req.session.user.id }, { password: hashedPassword })

                return res.status(200).json({
                    message: "Your password has been updated.",
                    success: true
                })
            } catch (error) {
                return res.status(401).json({
                    message: "Do logout and then try to do update password.",
                    success: false
                })
            }
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