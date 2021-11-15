import express from "express";
const router = new express.Router();
import { authenticateUser } from "../../helper/authenticateUser.js";

import {
  handleUserRegistration,
  handleGetAdminList,
  handleEditAdminDetails,
  getAdminDetails,
  handleDeleteAdminDetails,
  handleChangeAdminRole,
} from "./adminAuth_controller.js";

router.post("/admin/register", authenticateUser, handleUserRegistration);
router.get("/admins", authenticateUser, handleGetAdminList);
router.get("/admin/:id", authenticateUser, getAdminDetails);
router.patch("/admin/edit/:id", authenticateUser, handleEditAdminDetails);
router.patch("/admin/edit/role/:id", authenticateUser, handleEditAdminDetails);
router.delete("/admin/delete/:id", authenticateUser, handleChangeAdminRole);

export default router;
