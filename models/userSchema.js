import mongoose from "mongoose";

const User = new mongoose.Schema(
    {
        email: {
            type: String,
            require: true
        },
        password: {
            type: String,
            require: true
        },
        resetToken: {
            type: String,
            default: ""
        },
        createdAt: {
            type: Date,
            default: Date.now(),
            immutable: true
        },
        lastUpdate: {
            type: Date,
            default: Date.now()
        }
    },
    {
        versionKey: false
    }
);

export default mongoose.model("User", User);