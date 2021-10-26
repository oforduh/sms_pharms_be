import express from "express";
const router = new express.Router();

import { handleUserRegistration } from "./auth_controller.js";

router.post("/api/auth/register", handleUserRegistration);

export default router;
