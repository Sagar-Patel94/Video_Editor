const imageService = require("../services/imageService");

const annotation = async (req, res) => {
  let id = res.locals.Id;
  let imageData = await imageService.annotationImage(req.body, id);
  let result = {
    message: "Annotation Done...!",
    status: 200,
    data: imageData,
  };
  return res.status(200).json(result);
};

const getImage = async (req, res) => {
  let getImageById = {
    UserId: req.query.userId,
    GroupId: req.query.groupId,
  };
  const response = await imageService.getImageByUser(getImageById);
  return res.status(200).json(response);
};

module.exports = { annotation, getImage };
