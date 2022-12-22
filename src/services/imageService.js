const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const imageModel = require("../models/image");
const Path = require("path");
const jwt = require("jsonwebtoken");

ffmpeg.setFfmpegPath(ffmpegPath);

const annotationImage = async (objData, id) => {
  return await new Promise(async (resolve, reject) => {

    await imageModel.findOne({
      order: [["groupId", "DESC"]],
      attributes: ["groupId"],
    });

    let filename = objData.image.filename + `-user-${id}.png`;
    let sourcePath = objData.image.sourcePath;
    let outputPath = `public/images/annotationImages/${filename}`;

    let annotationImages = [];
    for (var i = 0; i < objData.annotation.length; i++) {
      annotationImages[i] = objData.annotation[i].imageUrl;
    }

    var annotation = ffmpeg(sourcePath);
    annotationImages.forEach(function (url) {
      annotation = annotation.input(url);
    });

    let array = [];
    let input;
    for (let i = 0; i < objData.annotation.length; i++) {
      if (i === 0) {
        input = `[${i}:v]`;
      } else {
        input = "[temp]";
      }
      array.push({
        filter: "overlay",
        options: {
          x: `${objData.annotation[i].scale_X}`,
          y: `${objData.annotation[i].scale_Y}`,
        },
        inputs: `${input}[${i + 1}:v]`,
        outputs: "temp",
      });
    }

    ffmpeg.ffprobe(sourcePath, (err, metaData) => {
      annotation
        .complexFilter(array, "temp")
        .output(outputPath)
        .on("progress", function (progres) {
          console.log("... frames :- " + progres.frames);
        })
        .on("end", async function (err) {
          if (!err) {
            console.log("conversion Done");
            let imageObj = {
              userId: id,
              filename: filename,
              url: outputPath,
              editType: "annotation",
            };
            var image = await imageModel.findOne({
              where: { Id: objData.imageId, editType: "annotation" },
            });
            if (image) {
              await imageModel.update(imageObj, {
                where: { Id: objData.imageId },
              });
              // let rootPath = Path.join(__dirname, "../../");
              // image.url = Path.join(rootPath, image.url);
              resolve(image);
            } else {
              let image = await imageModel.create(imageObj);
              // if (image) {
              //   let rootPath = Path.join(__dirname, "../../");
              //   image.url = Path.join(rootPath, image.url);
              // }
              resolve(image);
            }
          } else {
            console.log("conversion not done");
            reject();
          }
          resolve();
        })
        .on("error", (err) => console.error(err))
        .run();
    });
  });
};

const getImageByUser = async (getImageById) => {
  return await new Promise(async (resolve, reject) => {
    let findImage = await imageModel.findAll({
      where: { userId: getImageById.UserId, groupId: getImageById.GroupId },
    });
    resolve(findImage);
  });
};

module.exports = { annotationImage, getImageByUser };
