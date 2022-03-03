import express from "express";
const router = new express.Router();

import {
  handlePatientRegistration,
  updatePatientData,
  fetchPatientData,
  softDeletePatientData,
  deletePatientData,
  restoreThrashedPatientData,
  fetchThrashedPatientData,
  deleteSelectedPatientData,
  restoreSelectedPatientData,
  emptyThrashPatientData,
} from "./patientController.js";
import { authenticateUser } from "../../helper/authenticateUser.js";

router.post("/patient/register", authenticateUser, handlePatientRegistration);
router.patch("/patient/:patientId", authenticateUser, updatePatientData);
router.get("/patient", authenticateUser, fetchPatientData);
router.delete(
  "/patient/thrash/:patientId",
  authenticateUser,
  softDeletePatientData
);
router.delete(
  "/patient/delete/:patientId",
  authenticateUser,
  deletePatientData
);
router.get(
  "/patient/restore/:patientId",
  authenticateUser,
  restoreThrashedPatientData
);
router.get("/patient/thrash/", authenticateUser, fetchThrashedPatientData);
router.delete(
  "/select/patient/delete",
  authenticateUser,
  deleteSelectedPatientData
);
router.get(
  "/select/patient/restore",
  authenticateUser,
  restoreSelectedPatientData
);

router.delete(
  "/patient/deleteAll/thrash",
  authenticateUser,
  emptyThrashPatientData
);

export default router;
