import AdminModel from "../../model/admin.js";

export const handleUserRegistration = async (req, res) => {
  const { email, password, phonenumber } = req.body;
  try {
    console.log(phonenumber);
    const user = new AdminModel({ email, password, phonenumber });
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
      if (e.errors.phonenumber) {
        return res.status(400).send({
          message: e.errors.phonenumber.message,
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
    if (e.code === 11000) {
      if (e.keyValue.phonenumber) {
        return res.status(400).send({
          message: "Phonenumber already exist",
        });
      }
    }
    return res.status(400).send({
      e,
    });
  }
};

export const handleGetAdminList = async (req, res) => {
  try {
    const admins = await AdminModel.find();
    res
      .status(200)
      .send({ message: `Fetched ${admins.length} record(s)`, admins });
  } catch (e) {
    res.status(500).send({ error: "Could not fetch admin lists" });
  }
};
