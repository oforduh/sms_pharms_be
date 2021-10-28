import express from "express";
const router = new express.Router();

import {
  handleUserRegistration,
  handleUserLogin,
  handleUserLogout,
} from "./auth_controller.js";
import { authenticateUser } from "../../helper/authenticateUser.js";

router.post("/register", handleUserRegistration);
router.post("/login", handleUserLogin);
router.post("/logout", authenticateUser, handleUserLogout);
router.get("/dashboard", authenticateUser, function (req, res) {
  res.json({ message: "Welcome to the dashboard" });
});

export default router;
