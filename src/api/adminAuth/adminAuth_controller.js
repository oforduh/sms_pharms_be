import AdminModel from "../../model/admin.js";

export const handleUserRegistration = async (req, res) => {
  const { email, password, phonenumber, roles } = req.body;
  try {
    console.log(phonenumber);
    const user = new AdminModel({ email, password, phonenumber, roles });
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
    const data = [];

    for (const admin of admins) {
      const role = await roleModel.findById(admin.roles);

      const obj = admin;
      obj.roles.data = { ...role };

      data.push(obj);
    }

    res
      .status(200)
      .send({ message: `Fetched ${admins.length} record(s)`, admins: data });
  } catch (e) {
    res.status(500).send({ error: "Could not fetch admin lists" });
  }
};

export const handleEditAdminDetails = async (req, res) => {
  try {
    const { email } = req.body;
    const _id = req.params.id;
    let admin = await AdminModel.findOne({ _id });
    if (!admin) return res.status(401).json({ message: "Not Found" });
    admin.email = email;
    await admin.save();

    res
      .status(200)
      .send({ message: `Profile have been successfully Updated`, admin });
  } catch (e) {
    if (e.code === 11000) {
      if (e.keyValue.email) {
        return res.status(400).send({
          message: "Email already exist",
        });
      }
    }
  }
};

export const getAdminDetails = async (req, res) => {
  try {
    const _id = req.params.id;
    let admin = await AdminModel.findOne({ _id });

    admin.populate("roles").execPopulate();

    if (!admin) return res.status(401).json({ message: "User Not Found" });
    res.status(200).send({ admin });
  } catch (e) {
    res.status(500).send({ error: "User Not Found", e });
  }
};

export const handleDeleteAdminDetails = async (req, res) => {
  const _id = req.params.id;
  try {
    let admin = await AdminModel.findOneAndDelete({ _id });
    res.status(200).send({ message: `Deleted 1 record(s) permanently` });
  } catch (e) {
    res.status(500).send({ error: "Could not fetch admin lists" });
  }
};

export const handleChangeAdminRole = async (req, res) => {
  const _id = req.params.id;
  try {
    let admin = await AdminModel.findOne({ _id });
    console.log(admin);
    // res.status(200).send({ message: `Deleted 1 record(s) permanently` });
  } catch (e) {
    res.status(500).send({ error: "Could not fetch admin lists" });
  }
};
