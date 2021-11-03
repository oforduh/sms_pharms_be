import mongoose from "mongoose";
const schema = new mongoose.Schema(
  {
    role: {
      type: String,
      required: true,
    },

    permissions: [
      {
        permission: {
          type: String,
        },
      },
    ],
  },
  { timestamps: true }
);

schema.virtual("adminModel", {
  ref: "AdminModel",
  localField: "_id",
  foreignField: "roles",
});

const roleModel = mongoose.model("role", schema);
export default roleModel;
