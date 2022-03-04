import responses from "../../helper/responses.js";
import activityModel from "../../model/activityModel.js";

// fetch all activity data
export const fetchActivityData = async (req, res) => {
  try {
    const activities = await activityModel
      .find({ deletedAt: null })
      .skip(parseInt(req.query.skip))
      .limit(parseInt(req.query.limit));
    if (!activities)
      return responses.not_found({
        message: `activities not found`,
      });

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
      data: allActivities.reverse(),
    });
    x;
  } catch (error) {
    return responses.bad_request({ res, message: `Failed to fetch records` });
  }
};
