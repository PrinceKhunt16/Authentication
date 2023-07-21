import { model, models, Schema } from "mongoose"

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        picture: {
            type: String,
            required: true
        },
        otp: {
            type: String
        },
        otptimestamp: {
            type: Number
        }
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

export default models.User || model("User", userSchema);