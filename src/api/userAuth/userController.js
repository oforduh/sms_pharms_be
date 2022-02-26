import userModel from "../../model/userModel.js";
import responses from "../../helper/responses.js";
import bcrypt from "bcryptjs";

export const handleUserRegistration = async (req, res) => {
  const { email, password, fName, lName, age, phone } = req.body;
  try {
    const user = new userModel({ email, password, fName, lName, age, phone });
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
      if (e.errors.phone) {
        return res.status(400).send({
          message: `Insert a valid phone number`,
        });
      }
    }
    if (e.code === 11000) {
      if (e.keyValue.email) {
        return res.status(400).send({
          message: "Email already exist",
        });
      }
      if (e.keyValue.phone) {
        return res.status(400).send({
          message: "Phone number already exist",
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
    const allowedUpdates = ["fName", "lName", "age", "phone", "avatar"];

    // This array method returns true or false if the req.body matches the allowed updates
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });

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
      if (e.errors.phone) {
        return res.status(400).send({
          message: e.errors.phone.message,
        });
      }
    }
    return responses.bad_request({
      res,
      message: "Fail to Update Profile",
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
        message: "New password cannot be the same as the old password",
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

// An api functions that check if the token has expired
export const handleCheckUserToken = (req, res) => {
  try {
    responses.success({
      res,
      data: req.tokenExpiryDate,
    });
  } catch (e) {
    return responses.request_timeout({
      res,
      message: "Request Failed",
      e,
    });
  }
};

// An api that deletes a user profile picture
export const handleDeleteUserAvatar = async (req, res) => {
  try {
    if (!req.user.avatar) return;
    req.user.avatar = undefined;
    await req.user.save();
    responses.success({
      res,
      message: `user avatar has been deleted`,
    });
  } catch (e) {
    return responses.request_timeout({
      res,
      message: "Failed to remove avatar",
      e,
    });
  }
};

// A functions that check deletes a user profile picture
// export const handleClearOtherSession = async (req, res) => {
//   try {
//     req.user.tokens = [];
//     await req.user.save();
//     responses.success({
//       res,
//       message: `user avatar has been deleted`,
//     });
//   } catch (e) {
//     res.status(500).send();
//   }
// };
