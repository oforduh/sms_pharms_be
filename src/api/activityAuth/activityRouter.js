import express from "express";
const router = new express.Router();

import { fetchActivityData } from "./activityController.js";
import { authenticateUser } from "../../helper/authenticateUser.js";

router.get("/activity", authenticateUser, fetchActivityData);

export default router;
