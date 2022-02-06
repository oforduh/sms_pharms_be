import express from "express";
const router = new express.Router();

import {
  handleUserRegistration,
  handleUserLogin,
  handleUserLogout,
  getLoggedUserDetails,
  updateUserProfile,
  change_password,
  handleDeleteProfile,
} from "./userController.js";
import { authenticateUser } from "../../helper/authenticateUser.js";

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);
router.post("/logout", authenticateUser, handleUserLogout);
router.get("/user/me", authenticateUser, getLoggedUserDetails);
router.patch("/user/me/edit", authenticateUser, updateUserProfile);
router.post("/changePassword", authenticateUser, change_password);
router.delete("/user/me", authenticateUser, handleDeleteProfile);

export default router;
