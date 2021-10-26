import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,

    // validate is inbuilt while validator is a package
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is required");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// schema.pre();
schema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRETE);
  console.log(user.token);
  return token;
};

const superAdminModel = mongoose.model("user", schema);
export default superAdminModel;
