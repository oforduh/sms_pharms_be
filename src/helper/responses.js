const success = ({
  res,
  message,
  entity,
  data,
  token,
  totalPages,
  currentPage,
}) => {
  res.status(200).send({
    status: true,
    message,
    entity,
    data,
    token,
    totalPages,
    currentPage,
  });
};

const bad_request = ({ res, message, error }) => {
  res.status(400).send({
    status: false,
    message,
    error,
  });
};

const not_allowed = ({ res, message, error }) => {
  res.status(405).send({
    status: false,
    message,
    error,
  });
};

const not_found = ({ res, message, error }) => {
  res.status(404).send({
    status: false,
    message,
    error,
  });
};

const request_timeout = ({ res, message, error }) => {
  res.status(409).send({
    status: false,
    message,
    error,
  });
};

export default {
  success,
  bad_request,
  not_allowed,
  not_found,
  request_timeout,
};
