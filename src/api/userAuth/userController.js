import userModel from "../../model/userModel.js";
import responses from "../../helper/responses.js";
import bcrypt from "bcryptjs";

export const handleUserRegistration = async (req, res) => {
  const { email, password, fName, lName, age } = req.body;
  try {
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

// Update a user profile
export const updateUserProfile = async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["fName", "lName", "email", "age"];
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });

    console.log(isValidOperation);

    if (!isValidOperation)
      return responses.bad_request({
        res,
        message: "Update Failed",
      });
    updates.forEach((update) => {
      req.user[update] = req.body[update];
    });
    await req.user.save();
    return responses.success({
      res,
      data: req.user,
    });
  } catch (e) {
    if (e.kind === "Number") {
      return res.status(400).send({
        error: "Age Should be a number",
      });
    }
    if (e.code === 11000) {
      if (e.keyValue.email) {
        return res.status(400).send({
          message: "Email already exist",
        });
      }
    }
    if (e.name === "ValidationError") {
      if (e.errors.email) {
        return res.status(400).send({
          message: e.errors.email.message,
        });
      }
      if (e.errors.fName) {
        return res.status(400).send({
          message: e.errors.fName.message,
        });
      }
      if (e.errors.lName) {
        return res.status(400).send({
          message: e.errors.lName.message,
        });
      }
      if (e.errors.age) {
        return res.status(400).send({
          message: e.errors.age.message,
        });
      }
    }
    return responses.bad_request({
      res,
      message: "Update Failed",
      e,
    });
  }
};

// change a logged in user password
export const change_password = async (request, res) => {
  const user = request.user;

  try {
    const { old_password, new_password } = request.body;

    const is_match = await bcrypt.compare(old_password, user.password);
    const same_password = await bcrypt.compare(new_password, user.password);

    if (!is_match)
      return responses.bad_request({
        res,
        message: "Incorrect Password",
      });

    if (same_password)
      return responses.bad_request({
        res,
        message: "New Password cannot be the same as the old password",
      });

    user.password = new_password;
    await user.save();

    responses.success({
      res,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

// How to delete a user account from the database
export const handleDeleteProfile = async (req, res) => {
  try {
    await req.user.remove();
    return responses.success({
      res,
      message: "This Account has been Deleted",
      data: req.user,
    });
  } catch (e) {
    return responses.bad_request({
      res,
      message: "Unable to delete user ",
      e,
    });
  }
};
