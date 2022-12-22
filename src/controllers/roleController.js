const roleService = require("../services/roleService");

const createData = async (req, res) => {
  let data = await roleService.inputData(req.body);
  return res.status(200).json(data);
};

module.exports = { createData };