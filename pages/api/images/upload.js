import multer from "multer";
import nc from "next-connect"
import path from "path";

export const config = {
    api: {
        bodyParser: false,
    }
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/images");
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now() + Math.floor(Math.random() * 99999)}${path.parse(file.originalname).ext}`);
    }
});

const upload = multer({ storage });

export default nc().use(upload.single("picture")).post(async function (req, res) {
    res.status(200).send({
        filename: req.file.filename
    })
});