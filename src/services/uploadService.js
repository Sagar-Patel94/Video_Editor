const videoModel = require("../models/video");
const imageModel = require("../models/image");
const documentModel = require("../models/document");
const audioModal = require("../models/audio");
const Path = require("path");
const jwt = require("jsonwebtoken");

const { getVideoDurationInSeconds } = require("get-video-duration");

const upload = async (files, id) => {
  return await new Promise(async (resolve, reject) => {
    let response,
      message,
      status,
      data,
      filename,
      path,
      fileFormate,
      allFiles = [];

    if (
      files.file[0].mimetype === "video/mp4" ||
      files.file[0].mimetype === "video/x-msvideo"
    ) {
      var group = await videoModel.findOne({
        order: [["groupId", "DESC"]],
        attributes: ["groupId"],
      });
      let grpId = group != null ? parseInt(group.groupId) + 1 : 1;
      let sequence = 1;
      for (let i = 0; i < files.file.length; i++) {
        filename = files.file[i].filename;
        path = `public/videos/UploadedVideos/${filename}`;
        fileFormate = files.file[i].mimetype;

        var duration = await getVideoDurationInSeconds(path).then(
          (duration) => {
            let hours = Math.floor(duration / 3600);
            let minutes = Math.floor(duration / 60);
            let seconds = Math.floor(duration % 60);
            return Promise.resolve(hours + ":" + minutes + ":" + seconds);
          }
        );

        let dataObject = {
          userId: id,
          groupId: grpId,
          sequence :sequence,
          filename: filename,
          url: path,
          formate: fileFormate,
          editType: "Original",
          length: duration,
        };
        const video = await videoModel.create(dataObject);
        // if (video) {
        //   let rootPath = Path.join(__dirname, "../../");
        //   video.url = Path.join(rootPath, video.url);
        // }
        sequence += 1;
        allFiles.push(video);
      }

      data = allFiles;
      message = "Video uploaded successfully";
      status = 200;
    } else if (
      files.file[0].mimetype === "image/jpeg" ||
      files.file[0].mimetype === "image/jpg" ||
      files.file[0].mimetype === "image/png"
    ) {
      var group = await imageModel.findOne({
        order: [["groupId", "DESC"]],
        attributes: ["groupId"],
      });
      let grpId = group != null ? parseInt(group.groupId) + 1 : 1;
      let image;
      let sequence = 1;
      for (let i = 0; i < files.file.length; i++) {
        filename = files.file[i].filename;
        path = `public/images/UploadedImages/${filename}`;
        fileFormate = files.file[i].mimetype;

        let dataObject = {
          userId: id,
          groupId: grpId,
          sequence :sequence,
          filename: filename,
          url: path,
          formate: fileFormate,
          editType: "Original",
        };
        image = await imageModel.create(dataObject);
        // if (image) {
        //   let rootPath = Path.join(__dirname, "../../");
        //   image.url = Path.join(rootPath, image.url);
        // }
        sequence += 1;
        allFiles.push(image);
      }
      data = allFiles;
      message = "Image uploaded successfully";
      status = 200;
    } else if (
      files.file[0].mimetype === "application/pdf" || files.file[0].mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      var group = await documentModel.findOne({
        order: [["groupId", "DESC"]],
        attributes: ["groupId"],
      });
      let grpId = group != null ? parseInt(group.groupId) + 1 : 1;
      let sequence = 1;
      let document;
      for (let i = 0; i < files.file.length; i++) {
        filename = files.file[i].filename;
        path = `public/docFiles/uploadFiles/${filename}`;
        fileFormate = files.file[i].mimetype;

        let dataObject = {
          userId: id,
          groupId: grpId,
          sequence :sequence,
          filename: filename,
          url: path,
          formate: fileFormate,
          editType: "Original",
        };
        document = await documentModel.create(dataObject);
        // if (document) {
        //   let rootPath = Path.join(__dirname, "../../");
        //   document.url = Path.join(rootPath, document.url);
        // }
        sequence += 1;
        allFiles.push(document);
      }
      data = allFiles;
      message = "document uploaded successfully";
      status = 200;
    } else if (
      files.file[0].mimetype === "audio/mpeg"
    ) {
      var group = await audioModal.findOne({
        order: [["groupId", "DESC"]],
        attributes: ["groupId"],
      });
      let grpId = group != null ? parseInt(group.groupId) + 1 : 1;
      let sequence = 1;
      let document;
      for (let i = 0; i < files.file.length; i++) {
        filename = files.file[i].filename;
        path = `public/audios/uploadAudios/${filename}`;
        fileFormate = files.file[i].mimetype;

        let dataObject = {
          userId: id,
          groupId: grpId,
          sequence :sequence,
          filename: filename,
          url: path,
          formate: fileFormate,
          editType: "Original",
        };
        audio = await audioModal.create(dataObject);
        // if (document) {
        //   let rootPath = Path.join(__dirname, "../../");
        //   audio.url = Path.join(rootPath, audio.url);
        // }
        sequence += 1;
        allFiles.push(audio);
      }
      data = allFiles;
      message = "Audio uploaded successfully";
      status = 200;
    } else {
      data = null;
      message = "Image, video, audio or document Not found";
      status = 500;
    }
    response = {
      data: data,
      message: message,
      status: status,
    };
    if (response) {
      resolve(response);
    } else {
      response = {
        data: null,
        message: "Data not found",
        status: 500,
      };
      reject(response);
    }
  });
};

module.exports = { upload };
