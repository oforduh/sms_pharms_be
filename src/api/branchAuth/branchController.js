import branchModel from "../../model/branchModel.js";
import diseaseModel from "../../model/diseaseModel.js";
import activityModel from "../../model/activityModel.js";
import responses from "../../helper/responses.js";
import { handleError } from "../../helper/errorHandler.js";

// Create a new branch
export const handleBranchRegistration = async (req, res) => {
  try {
    const keys = Object.keys(req.body);
    const values = Object.values(req.body);
    const obj = {};

    values.map((item, index) => {
      if (item) {
        obj[keys[index]] = item;
      }
    });

    // create new branch
    const branch = new branchModel(obj);
    await branch.save();

    // add to the activity logs
    const activity = new activityModel({
      type: `new branch has Created`,
      user: req.user._id,
    });
    await activity.save();

    return responses.success({
      res,
      data: branch,
    });
  } catch (error) {
    const msg = `Could not create branch`;
    handleError({ error, responses, res, msg });
  }
};

// Update a branch data
export const updateBranchData = async (req, res) => {
  const branchId = req.params.branchId;
  try {
    const updates = Object.keys(req.body);
    const values = Object.values(req.body);
    const allowedUpdates = ["branch"];
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

    // check if the branch exists in the database
    const branch = await branchModel.findOne({ _id: branchId });
    if (!branch)
      return responses.not_found({
        res,
        message: `There is no branch associated with this Id`,
      });

    //Update the branch object
    values.map((item, idx) => {
      if (item) {
        branch[updates[idx]] = item;
      }
    });
    await branch.save();
    const activity = new activityModel({
      type: `branch has been edited`,
      user: req.user._id,
    });
    await activity.save();
    return responses.success({
      res,
      data: branch,
    });
  } catch (error) {
    const msg = `Could not update branch data`;
    handleError({ error, responses, res, msg });
  }
};

// fetch a single branch data
export const fetchSingleBranchData = async (req, res) => {
  const branchId = req.params.branchId;
  try {
    const branch = await branchModel.findOne({ _id: branchId });
    if (!branch)
      return responses.not_found({
        message: `branch not found`,
      });
    return responses.success({
      res,
      data: branch,
    });
  } catch (error) {
    fetchSingleBranchData;
    return responses.bad_request({
      res,
      message: `There is data with branch id (${branchId})`,
    });
  }
};

// fetch all branch data
export const fetchBranchData = async (req, res) => {
  let { page, limit = 10, sort } = req.query;
  if (!page) page = 1;
  if (!sort) sort = -1;
  try {
    const branchs = await branchModel
      .find({ deletedAt: null })
      .sort({ createdAt: sort })
      // .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    if (branchs < 1)
      return responses.not_found({
        message: `activities not found`,
      });

    // get total documents in the activity collection
    const count = await branchModel.countDocuments({ deletedAt: null });

    return responses.success({
      res,
      message: `There are ${branchs.length} Records`,
      data: branchs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    return responses.bad_request({ res, message: `Failed to fetch records` });
  }
};

// soft delete(thrash) a branch data
export const softDeleteBranchData = async (req, res) => {
  const branchId = req.params.branchId;
  try {
    const branch = await branchModel.findOne({ _id: branchId });
    if (!branch)
      return responses.not_found({
        message: `branch not found`,
      });
    branch.deletedAt = Date.now();
    await branch.save();
    // await branch.remove(); permanent delete
    const activity = new activityModel({
      type: `branch was moved to thrash`,
      user: req.user._id,
    });
    await activity.save();
    return responses.success({
      res,
      message: `The user with Id of ${branchId} has been Moved to thrash`,
    });
  } catch (error) {
    return responses.bad_request({
      res,
      message: `Failed to thrash branch data`,
    });
  }
};

// permanent delete a branch profile
export const deleteBranchData = async (req, res) => {
  const branchId = req.params.branchId;
  try {
    const branch = await branchModel.findOne({ _id: branchId });
    if (!branch)
      return responses.not_found({
        message: `branch not found`,
      });

    // Delete branch associated with it
    await diseaseModel.deleteMany({ branch: branchId });

    await branch.remove();
    const activity = new activityModel({
      type: `branch was deleted`,
      user: req.user._id,
    });
    await activity.save();
    return responses.success({
      res,
      message: `The user with Id of ${branchId} has been deleted`,
    });
  } catch (error) {
    return responses.bad_request({ res, message: `Failed to delete data` });
  }
};

// restore soft delete(thrash) a branch profile
export const restoreThrashedBranchData = async (req, res) => {
  const branchId = req.params.branchId;
  try {
    const branch = await branchModel.findOne({ _id: branchId });
    if (!branch)
      return responses.not_found({
        message: `branch not found`,
      });
    branch.deletedAt = null;
    await branch.save();
    // await branch.remove(); permanent delete
    const activity = new activityModel({
      type: `branch was restored from thrash`,
      user: req.user._id,
    });
    await activity.save();
    return responses.success({
      res,
      message: `The user with Id of ${branchId} has been Restored`,
    });
  } catch (error) {
    return responses.bad_request({ res, message: `Failed to restore data` });
  }
};

// fetch all thrashed branch data
export const fetchThrashedBranchData = async (req, res) => {
  let { page, limit = 10, sort } = req.query;
  if (!page) page = 1;
  if (!sort) sort = -1;
  try {
    // https://masteringjs.io/tutorials/mongoose/query-string
    const branchs = await branchModel
      .find({
        deletedAt: { $ne: null },
      })
      .sort({ createdAt: sort })
      // .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();
    if (!branchs)
      return responses.not_found({
        message: `branchs not found`,
      });
    // get total documents in the activity collection
    const count = await branchModel.countDocuments({
      deletedAt: { $ne: null },
    });

    return responses.success({
      res,
      message: `There are ${branchs.length} thrashed records`,
      data: branchs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.log(error);
    return responses.bad_request({ res, message: `Failed to fetch records` });
  }
};
// Thrash Selected branches data
export const thrashSelectedBranchData = async (req, res) => {
  try {
    const objId = req.body.id;
    for (let i = 0; i < objId.length; i++) {
      let branch = await branchModel.findOne({ _id: objId[i] });
      branch.deletedAt = Date.now();
      await branch.save();
    }
    const activity = new activityModel({
      type: `All selected branch has been moved to thrash`,
      user: req.user._id,
    });
    await activity.save();
    return responses.success({
      res,
      message: `All branches has been moved to the thrash can`,
    });
  } catch (error) {
    return responses.bad_request({
      res,
      message: `Fail to thrash selected data`,
    });
  }
};

// permanently delete Selected branches
export const deleteSelectedBranchData = async (req, res) => {
  try {
    const objId = req.body.id;
    for (let i = 0; i < objId.length; i++) {
      let branch = await branchModel.findOne({ _id: objId[i] });
      await branch.remove();
    }
    const activity = new activityModel({
      type: `All selected branch was deleted`,
      user: req.user._id,
    });
    await activity.save();
    return responses.success({
      res,
      message: `All branches has been deleted`,
    });
  } catch (error) {
    return responses.bad_request({ res, message: `Failed to delete data` });
  }
};

// Restore Selected branches
export const restoreSelectedBranchData = async (req, res) => {
  try {
    const objId = req.body.id;
    for (let i = 0; i < objId.length; i++) {
      let branch = await branchModel.findOne({ _id: objId[i] });
      branch.deletedAt = null;
      await branch.save();
    }
    const activity = new activityModel({
      type: `All selected branch was restored`,
      user: req.user._id,
    });
    await activity.save();
    return responses.success({
      res,
      message: `All branches has been restored`,
    });
  } catch (error) {
    return responses.bad_request({ res, message: `Failed to restore data` });
  }
};

// Empty the trash can
export const emptyThrashBranchData = async (req, res) => {
  try {
    const branch = await branchModel.deleteMany({ deletedAt: { $ne: null } });

    if (branch.deletedCount < 1)
      return responses.success({
        res,
        message: `There are no thrash to delete`,
      });
    const activity = new activityModel({
      type: `All branch in thrash has been deleted`,
      user: req.user._id,
    });
    await activity.save();
    return responses.success({
      res,
      message: `All branch has successfully been deleted`,
    });
  } catch (error) {
    return responses.bad_request({ res, message: `Failed to delete data` });
  }
};
