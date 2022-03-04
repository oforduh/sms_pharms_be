import mongoose from "mongoose";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

const schema = new mongoose.Schema(
  {
    branch: {
      required: true,
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
  },
  { timestamps: true }
);

schema.virtual("branchDiseases", {
  ref: "disease",
  localField: "_id",
  foreignField: "branch",
});
const branchModel = mongoose.model("branch", schema);
export default branchModel;
