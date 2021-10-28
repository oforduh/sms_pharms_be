import express from "express";
const router = new express.Router();
import { authenticateUser } from "../../helper/authenticateUser.js";

import {
  handleUserRegistration,
  handleGetAdminList,
} from "./adminAuth_controller.js";

router.post("/register", authenticateUser, handleUserRegistration);
router.get("/admins", authenticateUser, handleGetAdminList);

export default router;
