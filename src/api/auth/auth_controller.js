import superAdminModel from "../../model/superAdminModel.js";

export const handleUserRegistration = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = new superAdminModel({ email, password });
    await user.save();
    const token = user.generateAuthToken();
    res.status(200).json({ data: token });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};
