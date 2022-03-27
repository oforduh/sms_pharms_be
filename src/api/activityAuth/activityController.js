import responses from "../../helper/responses.js";
import activityModel from "../../model/activityModel.js";

// fetch all activity data
export const fetchActivityData = async (req, res) => {
  let { page, limit = 10, sort } = req.query;
  if (!page) page = 1;
  if (!sort) sort = -1;
  try {
    const activities = await activityModel
      .find({ deletedAt: null })
      .sort({ createdAt: sort })
      // .sort({ createdAt: "desc" })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    // if activities is an empty array
    if (activities.length < 1)
      return responses.not_found({
        message: `activities not found`,
      });

    // get total documents in the activity collection
    const count = await activityModel.countDocuments();

    const allActivities = [];

    for (let i = 0; i < activities.length; i++) {
      let data = await activities[i].populate({
        path: "user",
        select: "fName lName createdAt",
      });
      allActivities.push(data);
    }

    return responses.success({
      res,
      message: `There are ${allActivities.length} Records`,
      data: allActivities,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
    });
    x;
  } catch (error) {
    return responses.bad_request({ res, message: `Failed to fetch records` });
  }
};
