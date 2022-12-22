const uploadService = require("../services/uploadService");

const uploadFiles = async (req, res) => {
  let files = req.files;
  let id = res.locals.Id;
  const response = await uploadService.upload(files, id);
  return res.status(200).json(response);
};

module.exports = { uploadFiles };
