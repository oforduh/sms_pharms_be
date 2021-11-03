import roleModel from "../../model/roles.js";

export const handleCreateRoles = async (req, res) => {
  const { role } = req.body;
  try {
    let newRole = await roleModel.findByCredentials(role);
    newRole = new roleModel({ role });
    await newRole.save();
    res.status(200).json({ role: newRole });
  } catch (e) {
    return res.status(400).send({
      message: e.message,
    });
  }
};

export const handleGetRoleList = async (req, res) => {
  try {
    const roles = await roleModel.find();
    res
      .status(200)
      .send({ message: `Fetched ${roles.length} record(s)`, roles });
  } catch (e) {
    res.status(500).send({ error: "Could not fetch admin lists" });
  }
};
