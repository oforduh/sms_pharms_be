import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

schema.virtual("adminModel", {
  ref: "AdminModelUser",
  localField: "_id",
  foreignField: "roles",
});

schema.virtual("superAdminModel", {
  ref: "superAdminUser",
  localField: "_id",
  foreignField: "roles",
});

schema.statics.findByCredentials = async function (role) {
  const getRole = await roleModel.findOne({ role });
  if (getRole) {
    throw new Error("Role Exist");
  }
};

const roleModel = mongoose.model("role", schema);
export default roleModel;
