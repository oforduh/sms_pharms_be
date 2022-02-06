import express from "express";
const router = new express.Router();

import {
  handleUserRegistration,
  handleUserLogin,
  handleUserLogout,
  getLoggedUserDetails,
} from "./userController.js";
import { authenticateUser } from "../../helper/authenticateUser.js";

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);
router.post("/logout", authenticateUser, handleUserLogout);
router.get("/user/me", authenticateUser, getLoggedUserDetails);

export default router;
