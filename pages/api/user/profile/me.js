import connectToDB from "@/helper/connectToDB"
import { withSessionRoute } from "@/helper/iron"
import User from "@/models/user"

export default withSessionRoute(async function (req, res) {
    await connectToDB()

    if (req.method == "GET") {
        try {
            try {
                const user = await User.findOne({ _id: req.session.user.id }).select('-_id -password -createdAt -updatedAt')

                if (!user) {
                    return res.status(404).json({
                        message: "User not found.",
                        success: false
                    })
                }

                return res.status(200).json({
                    user: user,
                    success: true
                })
            } catch (error) {
                return res.status(401).json({
                    message: "Unvalid token.",
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
    } else if (req.method == "DELETE") {
        try {
            try {
                const user = await User.deleteOne({ _id: req.session.user.id })

                if (!user) {
                    return res.status(401).json({
                        message: "The user is not exists.",
                        success: false
                    })
                }

                return res.status(200).json({
                    message: "The uesr deleted successfully.",
                    success: true
                })
            } catch (error) {
                return res.status(401).json({
                    message: "Unvalid token.",
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