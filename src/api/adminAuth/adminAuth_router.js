import express from "express";
const router = new express.Router();
import { authenticateUser } from "../../helper/authenticateUser.js";

import {
  handleUserRegistration,
  handleGetAdminList,
  handleEditAdminDetails,
  getAdminDetails,
} from "./adminAuth_controller.js";

router.post("/register", authenticateUser, handleUserRegistration);
router.get("/admins", authenticateUser, handleGetAdminList);
router.get("/admin/:id", authenticateUser, getAdminDetails);
router.patch("/admin/edit/:id", authenticateUser, handleEditAdminDetails);

export default router;
