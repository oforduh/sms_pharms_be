export const handleError = ({ error, responses, res ,msg}) => {
  if (error) {
    if (error.errors)
      return responses.bad_request({
        res,
        message: `${msg}, the '${Object.keys(
          error.errors
        )[0].replace(/_/g, " ")}' field is missing or badly formatted`,
        error: `${Object.keys(error.errors)[0]
          .charAt(0)
          .toUpperCase()}${Object.keys(error.errors)[0]
          .replace(/_/g, " ")
          .slice(1)} is required`,
      });

    if (error.keyValue)
      return responses.bad_request({
        res,
        message: `${msg}, ${
          Object.keys(error.keyValue)[0]
        } already exists`,
        error: `${Object.keys(error.keyValue)[0]
          .charAt(0)
          .toUpperCase()}${Object.keys(error.keyValue)[0]
          .replace(/_/g, " ")
          .slice(1)} must be unique`,
      });
  }
};
