import responses from "../../helper/responses.js";
import activityModel from "../../model/activityModel.js";

// fetch all activity data
export const fetchActivityData = async (req, res) => {
  try {
    const activities = await activityModel.find({ deletedAt: null });
    if (!activities)
      return responses.not_found({
        message: `activities not found`,
      });

    const allActivities = [];

    for (let i = 0; i < activities.length; i++) {
      let data = await activities[i].populate("user", [
        "fName",
        "lName",
        "createdAt",
      ]);
      console.log(data);
      allActivities.push(data);
    }
    console.log(allActivities);
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
