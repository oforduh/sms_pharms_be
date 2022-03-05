import diseaseModel from "../../model/diseaseModel.js";
import responses from "../../helper/responses.js";
import branchModel from "../../model/branchModel.js";
import { handleError } from "../../helper/errorHandler.js";
import activityModel from "../../model/activityModel.js";

export const handleDiseaseRegistration = async (req, res) => {
  try {
    const { branch } = req.body;
    const checkBranch = await branchModel({ branch });
    if (!checkBranch)
      return responses.not_found({
        res,
        message: "Branch does not exist",
      });
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const obj = {};

    values.map((item, index) => {
      if (item) {
        obj[keys[index]] = item;
      }
    });
    const disease = new diseaseModel(obj);
    await disease.save();

    const activity = new activityModel({
      type: `Disease has been created`,
      user: req.user._id,
    });
    await activity.save();

    return responses.success({
      res,
      data: disease,
    });
  } catch (error) {
    const msg = `Could not create disease`;
    handleError({ error, responses, res, msg });
  }
};

// fetch all branch data
export const fetchDiseaseData = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const diseases = await diseaseModel
      .find({ deletedAt: null })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    if (diseases.length < 1)
      return responses.not_found({
        message: `diseases record not found`,
      });

    // get total documents in the activity collection
    const count = await diseaseModel.countDocuments();
    const allDiseases = [];

    for (let i = 0; i < diseases.length; i++) {
      let data = await diseases[i].populate("branch", ["branch"]);
      allDiseases.push(data);
    }
    return responses.success({
      res,
      message: `There are ${allDiseases.length} Records`,
      data: allDiseases.reverse(),
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    return responses.bad_request({ res, message: `Failed to fetch records` });
  }
};
