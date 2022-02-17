import mongoose from "mongoose";
import validator from "validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
dotenv.config();

const schema = new mongoose.Schema(
  {
    fName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    lName: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) {
          throw new Error("age must be a positive number");
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,

      // validate is inbuilt while validator is a package
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email Address");
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      validate(value) {
        let number = value;
        if (number.chartAt(0) === "+") {
          if (number.substring(0, 4) !== "+234") {
            throw new Error("Invalid phone number");
          }
          number = number.substring(4);
        }
        if (!validator.isMobilePhone(number, ["en-NG"])) {
          throw new Error("invalid phone number");
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true }
);

// convert the user mongo object to a json object and delete some user field
schema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;
  delete userObject.createdAt;
  delete userObject.updatedAt;
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

// check if the credentials already exst in the database
schema.statics.findByCredentials = async function (email, password) {
  const user = await userModel.findOne({ email });
  if (!user) {
    throw new Error("Incorrect Email or Password");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Incorrect Email or Password");
  }
  return user;
};

const userModel = mongoose.model("user", schema);
export default userModel;