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

    // convert the time to minutes (60s * 1k)
    let time = Date.now() - decoded.exp * 1000;
    time = time / 60000;

    // find a user who owns the token
    const user = await userModel.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });

    // throw error if there are no users
    if (!user) {
      return res.status(401).json({
        message: "Token Expired",
        code: 408,
      });
    }

    // add the token and user to the request object
    req.token = token;
    req.user = user;

    // checks if the token has exxpired then it deletes the token from the user database
    if (time >= 1440) {
      req.user.tokens = req.user.tokens.filter((token) => {
        return token.token !== req.token;
      });
      await req.user.save();
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: "No token, authorization denied",
      code: 408,
    });
  }
};
