const videoService = require("../services/videoService");

const trim = async (req, res) => {
  let id = res.locals.Id;
  let trimedData = await videoService.trim(req.body, id);
  let response = {
    message: "Data successfully uploaded",
    status: 200,
    data: trimedData,
  };
  return res.status(200).json(response);
};

const merge = async (req, res) => {
  let id = res.locals.Id;
  let mergedVideo = await videoService.merge(req.body, id);
  let response = {
    message: "Data successfully uploaded",
    status: 200,
    data: mergedVideo,
  };
  return res.status(200).json(response);
};

const getVideo = async (req, res) => {
  let id = {
    getVideoByUserId: req.query.userId,
    getVideoByGroupId: req.query.groupId,
  };
  const response = await videoService
    .getVideoByUser(id)
    .then((data) => {
      console.log(data, "111111111111");
      if (data != null || data != undefined) {
        return res
          .status(200)
          .json({
            status: 200,
            message: "Data fetch successfully",
            data: data,
          });
      } else {
        return res
          .status(200)
          .json({ status: 200, message: "No data found", data: data });
      }
    })
    .catch((err) => {
      return res
        .status(200)
        .json({ status: 500, message: "Data fetching error", data: err });
    });
  // console.log(response.video, "555555555555555")
  // if (response) {
  //   return res.status(200).json({
  //     status: 200,
  //     message: "Data fetch successfully",
  //     data: response,
  //   });
  // } else {
  //   return res
  //     .status(200)
  //     .json({ status: 200, message: "No data found", data: response });
  // }
};

const annotation = async (req, res) => {
  let id = res.locals.Id;
  let annotationVideo = await videoService.annotation(req.body, id);
  let response = {
    message: "Annotation Done...!",
    status: 200,
    data: annotationVideo,
  };
  return res.status(200).json(response);

  // let objData = {
  //   SourcePath: req.files.file[0].path,
  //   AddImage: req.files.addImage[0].path,
  //   EndTime: req.body.endTime,
  //   Scale_X: req.body.scale_X,
  //   Scale_Y: req.body.scale_Y,
  //   StartTime: req.body.startTime,
  //   EndTime: req.body.endTime,
  //   Formate: req.files.file[0].mimetype
  // };
  // let annotationVideo = await videoService.annotation(objData);
  // let result = {
  //   message: "Annotation Done...!",
  //   status: 200,
  //   data: annotationVideo,
  // };
  // return res.status(200).json(result);
};

const mergeById = async (req, res) => {
  let id = res.locals.Id;
  const response = await videoService.mergeByGroupId(req.query, id);
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

const strings = async (req, res) => {
  let id = res.locals.Id;
  const response = await videoService.addStrings(req.body, id);
  if (response) {
    return res.status(200).json({
      status: 200,
      message: "Conversion Done........!",
      data: response,
    });
  } else {
    return res
      .status(200)
      .json({ status: 200, message: "No data found", data: response });
  }
};

const annotationString = async (req, res) => {
  let id = res.locals.Id;
  const response = await videoService.annoStr(req.body, id);
  if (response) {
    return res.status(200).json({
      status: 200,
      message: "Conversion Done........!",
      data: response,
    });
  } else {
    return res
      .status(200)
      .json({ status: 200, message: "No data found", data: response });
  }
}

module.exports = { trim, merge, getVideo, annotation, mergeById, strings, annotationString };
