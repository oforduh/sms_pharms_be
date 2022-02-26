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
  },
  { timestamps: true }
);

const diseaseModel = mongoose.model("disease", schema);
export default diseaseModel;
