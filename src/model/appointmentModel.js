import mongoose from "mongoose";
import validator from "validator";
import dotenv from "dotenv";
dotenv.config();

const schema = new mongoose.Schema(
  {
    fname: {
      type: String,
      lowercase: true,
      trim: true,
    },
    lName: {
      type: String,
      lowercase: true,
      trim: true,
    },
    email: {
      type: String,
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
    phone: {
      type: String,
      unique: true,
      validate(value) {
        let number = value;
        if (number.charAt(0) === "+") {
          if (number.substring(0, 4) !== "+234") {
            throw new Error("Invalid phone number");
          }
          number = number.substring(4);
        }
        // check if the string is a Nigerian mobile phone number
        if (!validator.isMobilePhone(number, ["en-NG"])) {
          throw new Error("invalid phone number");
        }
      },
    },
    avatar: {
      type: String,
    },
  },
  { timestamps: true }
);

const patientModel = mongoose.model("patientModelUser", schema);
export default patientModel;
