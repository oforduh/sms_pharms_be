import express from "express";
const router = new express.Router();

import {
  handleBranchRegistration,
  updateBranchData,
  fetchBranchData,
  softDeleteBranchData,
  deleteBranchData,
  restoreThrashedBranchData,
  fetchThrashedBranchData,
  deleteSelectedBranchData,
  restoreSelectedBranchData,
  emptyThrashBranchData,
  fetchSingleBranchData,
  thrashSelectedBranchData,
} from "./branchController.js";
import { authenticateUser } from "../../helper/authenticateUser.js";

router.post("/branch/register", authenticateUser, handleBranchRegistration);
router.patch("/branch/:branchId", authenticateUser, updateBranchData);
router.get("/branch", authenticateUser, fetchBranchData);
router.get("/branch/thrash", authenticateUser, fetchThrashedBranchData);
router.get("/branch/:branchId", authenticateUser, fetchSingleBranchData);

router.delete("/branch/delete/:branchId", authenticateUser, deleteBranchData);
router.get(
  "/select/branch/restore",
  authenticateUser,
  restoreSelectedBranchData
);
router.get(
  "/branch/restore/:branchId",
  authenticateUser,
  restoreThrashedBranchData
);

router.delete(
  "/select/branch/delete",
  authenticateUser,
  deleteSelectedBranchData
);

router.delete(
  "/select/branch/thrash",
  authenticateUser,
  thrashSelectedBranchData
);
router.delete(
  "/branch/thrash/:branchId",
  authenticateUser,
  softDeleteBranchData
);

router.delete(
  "/branch/deleteAll/thrash",
  authenticateUser,
  emptyThrashBranchData
);

export default router;
