import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import userModel from "../model/userModel.js";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");

    if (!token)
      return res.status(401).json({
        message: "Token not found",
      });

    // decode the token using jwt.decode
    const decoded = jwt.decode(token, process.env.JWT_SECRETE);

    // find a user who owns the token
    const user = await userModel.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    // throw error if there are no users
    if (!user) {
      return res.status(401).json({
        message: "Unable to fetch logged in user",
        code: 401,
      });
    }

    // add the token and user to the request object
    req.token = token;
    req.user = user;

    next();
  } catch (error) {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    console.log(error);
    return res.status(401).json({
      message: "No token, authorization denied",
      code: 408,
    });
  }
};
