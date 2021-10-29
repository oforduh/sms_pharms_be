import superAdminModel from "../../model/superAdminModel.js";

export const handleUserRegistration = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = new superAdminModel({ email, password });
    await user.save();
    const token = await user.generateAuthToken();
    res.status(200).json({ data: user, token: token });
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
    // check if the request is empty
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "username and password are required" });
    }
    const user = await superAdminModel.findByCredentials(email, password);
    const token = await user.generateAuthToken();
    res.status(200).json({ data: user, token: token });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Invalid username or password" });
  }
};

export const handleUserLogout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    res.status(200).send({ message: req.user.tokens });
    await req.user.save();

    res.status(200).send({ message: "Logged out successfully" });
  } catch (e) {
    res.status(500).send();
  }
};

export const getLoggedUserDetails = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send({ user });
  } catch (e) {
    res.status(401).json({ message: "unable to fetch logged in user" });
  }
};
