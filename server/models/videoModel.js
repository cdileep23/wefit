import mongoose from "mongoose";

const videoModel = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"

    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    videoLink: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Video = mongoose.model("Video", videoModel);

export default Video;
