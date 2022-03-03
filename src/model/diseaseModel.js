import mongoose from "mongoose";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

const schema = new mongoose.Schema(
  {
    disease: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
    },
    // soft delete
    deletedAt: {
      type: String,
      default: null,
    },

    // branch and disease relationship
    branch: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "branch",
    },
  },
  { timestamps: true }
);

const diseaseModel = mongoose.model("disease", schema);
export default diseaseModel;
