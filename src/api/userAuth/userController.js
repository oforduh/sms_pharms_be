import userModel from "../../model/userModel.js";
import responses from "../../helper/responses.js";

export const handleUserRegistration = async (req, res) => {
  const { email, password, fName, lName, age } = req.body;
  try {
    // if (!email || !password || !fName || lName)
    //   return responses.not_found({
    //     res,
    //     message: "Insert the required input field",
    //   });
    const user = new userModel({ email, password, fName, lName, age });
    await user.save();
    const token = await user.generateAuthToken();
    return responses.success({
      res,
      data: user,
      token: token,
    });
  } catch (e) {
    if (e.name === "ValidationError") {
      if (e.errors.email) {
        return res.status(400).send({
          message: e.errors.email.message,
        });
      }
      if (e.errors.password) {
        return res.status(400).send({
          message: e.errors.password.message,
        });
      }
      if (e.errors.lName) {
        return res.status(400).send({
          message: e.errors.lName.message,
        });
      }
      if (e.errors.fName) {
        return res.status(400).send({
          message: e.errors.fName.message,
        });
      }
    }
    if (e.code === 11000) {
      if (e.keyValue.email) {
        return res.status(400).send({
          message: "Email already exist",
        });
      }
    }
  }
};

export const handleUserLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password)
      return responses.not_found({
        res,
        message: "username and password are required",
      });

    const user = await userModel.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    return responses.success({
      res,
      data: user,
      token: token,
    });
  } catch (error) {
    console.log(error);
    return responses.bad_request({
      res,
      message: error.message,
    });
  }
};

export const handleUserLogout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();
    return responses.success({
      res,
      message: "Logout successful",
    });
  } catch (e) {
    console.log(e);
    return responses.bad_request({
      res,
      message: "Invalid or Expired Token",
      e,
    });
  }
};

export const getLoggedUserDetails = async (req, res) => {
  try {
    const user = req.user;
    if (!user)
      return responses.not_found({
        res,
        message: "No existing user",
      });
    return responses.success({
      res,
      data: user,
    });
  } catch (e) {
    console.log(e);
    return responses.bad_request({
      res,
      message: "Server Error ",
      e,
    });
  }
};
