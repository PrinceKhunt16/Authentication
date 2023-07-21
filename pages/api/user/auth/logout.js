import { withSessionRoute } from "../../../../helper/iron";

export default withSessionRoute((req, res) => {
    req.session.destroy();

    res.send({
        message: "Logout successfully.",
        success: true
    })
})