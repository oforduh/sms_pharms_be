import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const schema = new mongoose.Schema(
  {
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
    phonenumber: {
      type: String,
      trim: true,
      unique: true,
      validate(value) {
        let number = value;

        if (number.charAt(0) === "+") {
          if (number.substring(0, 4) !== "+234")
            throw new Error("Invalid phone number");
          number = number.substring(4);
        }

        // We removed the +234 so we can pass it as a validator to validate if it is a nigerina number
        if (!validator.isMobilePhone(number, ["en-NG"])) {
          throw new Error("Invalid phone number");
        }
      },
    },
  },
  { timestamps: true }
);

// convert the user mogo object to a json object and delete some user field
schema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  return userObject;
};

// This generate tokens for all new users
schema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRETE);
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

// Hash the password before it saves to the database
schema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
});

const AdminModel = mongoose.model("AdminModelUser", schema);
export default AdminModel;
