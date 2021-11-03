import express from "express";
const router = new express.Router();
import { authenticateUser } from "../../helper/authenticateUser.js";

import { handleCreateRoles, handleGetRoleList } from "./roleAuth_controller.js";

router.post("/create_role", authenticateUser, handleCreateRoles);
router.get("/roles", authenticateUser, handleGetRoleList);

export default router;
