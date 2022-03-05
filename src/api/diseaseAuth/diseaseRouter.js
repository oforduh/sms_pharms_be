import express from "express";
const router = new express.Router();

import {
  handleDiseaseRegistration,
  fetchDiseaseData,
  updateDiseaseData,
} from "./diseaseController.js";
import { authenticateUser } from "../../helper/authenticateUser.js";

router.post("/disease/register", authenticateUser, handleDiseaseRegistration);
router.patch("/disease/:diseaseId", authenticateUser, updateDiseaseData);
router.get("/disease", authenticateUser, fetchDiseaseData);

// router.delete("/Disease/delete/:DiseaseId", authenticateUser, deleteDiseaseData);
// router.get(
//   "/Disease/restore/:DiseaseId",
//   authenticateUser,
//   restoreThrashedDiseaseData
// );
// router.get("/Disease/thrash", authenticateUser, fetchThrashedDiseaseData);

// router.delete(
//   "/select/Disease/delete",
//   authenticateUser,
//   deleteSelectedDiseaseData
// );
// router.get(
//   "/select/Disease/restore",
//   authenticateUser,
//   restoreSelectedDiseaseData
// );
// router.delete(
//   "/Disease/deleteAll/thrash",
//   authenticateUser,
//   emptyThrashDiseaseData
// );

// router.delete(
//   "/Disease/thrash/:DiseaseId",
//   authenticateUser,
//   softDeleteDiseaseData
// );

export default router;
