const Role = require("../models/roles");

const inputData = async (roleData) => {
    console.log(roleData)
  let data = await Role.create({
    name: roleData.Name
  });
  return data;
};

module.exports = { inputData };