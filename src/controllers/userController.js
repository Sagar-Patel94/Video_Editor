const userService = require("../services/userService");

const createData = async (req, res) => {
  await userService.inputData(req.body);
  let response = {
    status: 200,
    message: "Data successfully created",
  };
  return res.status(200).json(response);
};

const findUser = async (req, res) => {
  let getUserById = {
    id: req.query.Id,
    RoleId: req.query.roleId,
  };
  const response = await userService.getUserByUser(getUserById);
  if (response) {
    return res.status(200).json({
      status: 200,
      message: "Data fetch successfully",
      data: response,
    });
  } else {
    return res
      .status(200)
      .json({ status: 200, message: "No data found", data: response });
  }
};

const login = async (req, res) => {
  const response = await userService.userLogin(req.body);
  if (response) {
    return res.status(200).json(response);
  } else {
    return res
      .status(200)
      .json({ status: 200, message: "No data found", data: response });
  }
};

module.exports = { createData, findUser, login };
