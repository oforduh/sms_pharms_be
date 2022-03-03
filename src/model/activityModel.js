import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const schema = new mongoose.Schema(
  {
    type: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },

    // branch and activity relationship
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
  },
  { timestamps: true }
);

const activityModel = mongoose.model("activity", schema);
export default activityModel;
