import connectToDB from "@/helper/connectToDB"
import { withSessionRoute } from "@/helper/iron"
import User from "@/models/user"
import bcrypt from "bcrypt"

export default withSessionRoute(async function (req, res) {
    await connectToDB()

    if (req.method == "POST") {
        try {
            const response = await User.findOne({ _id: req.session.user.id })
            const nowtimestamp = Date.now()

            const match = await bcrypt.compare(req.body.otp, response.otp)

            const maxtimestamp = response.otptimestamp + 300000

            if (match && req.session.user.id) {
                if (nowtimestamp <= maxtimestamp) {
                    const hashedPassword = await bcrypt.hash(req.body.password, 10);

                    await User.findOneAndUpdate({ _id: req.session.user.id }, {
                        password: hashedPassword,
                        $unset: {
                            otp: response.otp,
                            otptimestamp: response.otptimestamp
                        }
                    })

                    return res.status(200).json({
                        message: "Your password updated successfully.",
                        success: true
                    })
                } else {
                    await User.findOneAndUpdate({ _id: req.session.user.id }, {
                        $unset: {
                            otp: response.otp,
                            otptimestamp: response.otptimestamp
                        }
                    })

                    return res.status(401).json({
                        message: "Your OTP time limit exceeded.",
                        success: false
                    })
                }
            } else {
                return res.status(401).json({
                    message: "You entered an invalid OTP.",
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