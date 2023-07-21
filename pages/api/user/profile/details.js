import connectToDB from "@/helper/connectToDB"
import { withSessionRoute } from "@/helper/iron"
import User from "@/models/user"

export default withSessionRoute(async function (req, res) {
    await connectToDB()

    if (req.method == "POST") {
        const user = await User.findOne({ _id: req.session.user.id })

        if (!user) {
            return res.status(401).json({
                message: "User does not exist.",
                success: false
            })
        }

        await User.findOneAndUpdate({ _id: req.session.user.id }, {
            name: req.body.name
        })

        return res.status(200).json({
            message: "User updated.",
            success: true
        })
    }

    return res.status(405).json({
        message: "Method not allowed.",
        success: false
    })
})