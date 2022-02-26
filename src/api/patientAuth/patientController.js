import patientModel from "../../model/patientModel.js";
import responses from "../../helper/responses.js";
import { handleError } from "../../helper/errorHandler.js";

// Create a patient profile
export const handlePatientRegistration = async (req, res) => {
  try {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const obj = {};

    values.map((item, index) => {
      if (item) {
        obj[keys[index]] = item;
      }
    });
    const patient = new patientModel(obj);
    await patient.save();
    return responses.success({
      res,
      data: patient,
    });
  } catch (error) {
    const msg = `Could not create patient`;
    handleError({ error, responses, res, msg });
  }
};

// Update a patient profile
export const updatePatientData = async (req, res) => {
  const patientId = req.params.patientId;
  try {
    const updates = Object.keys(req.body);
    const values = Object.values(req.body);
    const allowedUpdates = ["fName", "lName", "phone", "email", "avatar"];

    // This array method returns true or false if the req.body matches the allowed updates
    const isValidOperation = updates.every((update) => {
      return allowedUpdates.includes(update);
    });

    // Throw an error message if it turns out to be false
    if (!isValidOperation)
      return responses.bad_request({
        res,
        message: "Update Failed",
      });

    // check if the patient exists in the database
    const patient = await patientModel.findOne({ _id: patientId });
    if (!patient)
      return responses.not_found({
        res,
        message: `There is no user associated with this Id`,
      });

    //   Update the patient object
    values.map((item, idx) => {
      if (item) {
        patient[updates[idx]] = item;
      }
    });
    await patient.save();
    return responses.success({
      res,
      data: patient,
    });
  } catch (error) {
    const msg = `Could not update patient data`;
    handleError({ error, responses, res, msg });
  }
};

// fetch all patient data
export const fetchPatientData = async (req, res) => {
  try {
    const patients = await patientModel.find({ deletedAt: null });
    if (!patients)
      return responses.not_found({
        message: `Patients not found`,
      });
    return responses.success({
      res,
      message: `There are ${patients.length} Records`,
      data: patients,
    });
  } catch (error) {
    return responses.bad_request({ res, message: `Failed to fetch records` });
  }
};

// soft delete(thrash) a patient profile
export const softDeletePatientData = async (req, res) => {
  const patientId = req.params.patientId;
  try {
    const patient = await patientModel.findOne({ _id: patientId });
    if (!patient)
      return responses.not_found({
        message: `Patient not found`,
      });
    patient.deletedAt = Date.now();
    await patient.save();
    // await patient.remove(); permanaent delete
    return responses.success({
      res,
      message: `The user with Id of ${patientId} has been Moved to thrash`,
    });
  } catch (error) {
    return responses.bad_request({
      res,
      message: `Failed to thrash patient data`,
    });
  }
};

// fetch all thrashed patient data
export const fetchThrashedPatientData = async (req, res) => {
  try {
    // https://masteringjs.io/tutorials/mongoose/query-string
    const patients = await patientModel.find({
      deletedAt: { $ne: null },
    });
    if (!patients)
      return responses.not_found({
        message: `Patients not found`,
      });
    return responses.success({
      res,
      message: `There are ${patients.length} thrashed records`,
      data: patients,
    });
  } catch (error) {
    console.log(error);
    return responses.bad_request({ res, message: `Failed to fetch records` });
  }
};

// restore soft delete(thrash) a patient profile
export const restoreThrashedPatientData = async (req, res) => {
  const patientId = req.params.patientId;
  try {
    const patient = await patientModel.findOne({ _id: patientId });
    if (!patient)
      return responses.not_found({
        message: `Patient not found`,
      });
    patient.deletedAt = null;
    await patient.save();
    // await patient.remove(); permanaent delete
    return responses.success({
      res,
      message: `The user with Id of ${patientId} has been Restored`,
    });
  } catch (error) {
    return responses.bad_request({ res, message: `Failed to restore data` });
  }
};

// permanent delete a patient profile
export const deletePatientData = async (req, res) => {
  const patientId = req.params.patientId;
  try {
    const patient = await patientModel.findOne({ _id: patientId });
    if (!patient)
      return responses.not_found({
        message: `Patient not found`,
      });

    await patient.remove();
    return responses.success({
      res,
      message: `The user with Id of ${patientId} has been deleted`,
    });
  } catch (error) {
    return responses.bad_request({ res, message: `Failed to delete data` });
  }
};
