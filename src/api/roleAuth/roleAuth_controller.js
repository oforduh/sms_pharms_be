import roleModel from "../../model/roles.js";

export const handleCreateRoles = async (req, res) => {
  const { role } = req.body;
  try {
    const role = new roleModel({ role });
    await role.save();
  } catch (e) {
    return res.status(400).send({
      e,
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
                                                