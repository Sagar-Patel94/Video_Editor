const ffmpeg = require("fluent-ffmpeg");
const pathToFfmpeg = require("ffmpeg-static");
const ffprobe = require("ffprobe-static");
const Path = require("path");
const fs = require("fs");
const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
const videoModel = require("../models/video");

ffmpeg.setFfmpegPath(
  Path.join(__dirname, "../../packages/ffmpeg/bin/ffmpeg.exe")
);
ffmpeg.setFfprobePath(
  Path.join(__dirname, "../../packages/ffmpeg/bin/ffprobe.exe")
);

var videoNames = [];

const getVideoByUser = async (getVideoById) => {
  return await new Promise(async (resolve, reject) => {
    await videoModel
      .findAll({
        where: {
          userId: getVideoById.getVideoByUserId,
          groupId: getVideoById.getVideoByGroupId,
        },
      })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const trim = async (data, id) => {
  return await new Promise(async (resolve, reject) => {
    let filename = data.filename + `-user-${id}.mp4`;
    let sourcePath = data.path;
    let startTime = data.startTime;
    let duration = data.duration;
    let outputPath = `public/videos/TrimVideos/${filename}`;

    ffmpeg()
      .input(sourcePath)
      .setFfmpegPath(pathToFfmpeg)
      .setFfprobePath(ffprobe.path)
      .inputOptions([`-ss ${startTime}`])
      .outputOptions([`-t ${duration}`])
      .output(outputPath)
      .on("progress", function (progress) {
        console.log("Progress :- ", +Math.floor(progress.percent));
      })
      .on("end", async function (err) {
        if (err) {
          console.log("conversion not done", err);
        } else {
          console.log("conversion Done");
          var videoObj = {
            userId: id,
            filename: `${filename}`,
            url: `${outputPath}`,
            formate: "video/mp4",
            editType: "trim",
            length: `${duration}`,
          };
          var video = await videoModel.findOne({
            where: { Id: data.videoId, editType: "trim" },
          });
          if (video) {
            await videoModel.update(videoObj, { where: { Id: data.videoId } });
            // let rootPath = Path.join(__dirname, "../../");
            // video.url = Path.join(rootPath, video.url);
            resolve(video);
          } else {
            let video = await videoModel.create(videoObj);
            // if (video) {
            //   let rootPath = Path.join(__dirname, "../../");
            //   video.url = Path.join(rootPath, video.url);
            // }
            resolve(video);
          }
        }
      })
      .on("error", function (err) {
        console.log("error: ", err);
        reject(err);
      })
      .run();
  });
};

const merge = async (videoFiles, id) => {
  return await new Promise(async (resolve, reject) => {
    let urls = videoFiles.urls;
    for (var i = 0; i < urls.length; i++) {
      let tempFilename1 = `${Date.now()}_pixel.mp4`;
      let outputPth = `public/videos/tempVideos/${tempFilename1}`;
      ffmpeg(urls[i])
        .setFfmpegPath(ffmpegInstaller.path)
        .output(outputPth)
        .videoCodec("libx264")
        .withSize(`${videoFiles.width}x${videoFiles.height}`)
        .applyAutopadding(true, "black")
        .on("error", function (error) {
          const directory = "public/videos/tempVideos";
          fs.readdir(directory, (err, files) => {
            if (err) reject(err);
            for (const file of files) {
              fs.unlink(Path.join(directory, file), (err) => {
                if (err) throw err;
              });
            }
            console.log("An error occurred: " + error.message);
            reject(error);
          });
        })
        .on("progress", function (progres) {
          console.log("... frames :- " + progres.frames);
        })
        .on("end", function () {
          console.log("now please wait.....merge will start ....soon");
        })
        .run();
    }
    let filename, mergedVideoFilepath;

    setTimeout(async function () {
      const rootFolder = Path.join(
        __dirname,
        "../../public/videos/tempVideos/"
      );
      await readdir(rootFolder);
      var group = await videoModel.findOne({
        order: [["groupId", "DESC"]],
        attributes: ["groupId"],
      });
      let tempFilename = `${Date.now()}-user-${id}.mp4`;
      filename = `public/videos/mergedVideos/${tempFilename}`;
      mergedVideoFilepath = Path.join("mergedVideos", tempFilename);
      var mergedVideo = ffmpeg();
      videoNames.forEach(function (url) {
        mergedVideo = mergedVideo.addInput(url);
      });

      mergedVideo
        .setFfmpegPath(ffmpegInstaller.path)
        .on("progress", function (progress) {
          console.log("Merging :- " + Math.floor(progress.percent));
        })
        .on("error", function (err) {
          console.log("An error occurred: " + err.message);
          reject(err);
        })
        .on("end", async function () {
          console.log("Merging finished !");
          const directory = "public/videos/tempVideos";
          fs.readdir(directory, (err, files) => {
            if (err) reject(err);
            for (const file of files) {
              fs.unlink(Path.join(directory, file), (err) => {
                if (err) throw err;
              });
            }
          });
          var videoObj = {
            userId: id,
            filename: `${tempFilename}`,
            url: `${filename}`,
            formate: "video/mp4",
            editType: "merge",
          };
          var video = await videoModel.findOne({
            where: { Id: videoFiles.videoId, editType: "merge" },
          });
          if (video) {
            await videoModel.update(videoObj, {
              where: { Id: videoFiles.videoId },
            });
            // let rootPath = Path.join(__dirname, "../../");
            // video.url = Path.join(rootPath, video.url);
            resolve(video);
          } else {
            let video = await videoModel.create(videoObj);
            // if (video) {
            //   let rootPath = Path.join(__dirname, "../../");
            //   video.url = Path.join(rootPath, video.url);
            // }
            resolve(video);
          }
        })
        .mergeToFile(`${filename}`);
    }, 50000);
  });
};

const annotation = async (objData, id) => {
  return await new Promise(async (resolve, reject) => {
    await videoModel.findOne({
      order: [["groupId", "DESC"]],
      attributes: ["groupId"],
    });
    let filename = objData.video.filename + `-user-${id}.mp4`;
    let sourcePath = objData.video.sourcePath;
    let outputPath = `public/videos/annotationVideos/${filename}`;

    let annotationVideos = [];
    for (var i = 0; i < objData.annotation.length; i++) {
      annotationVideos[i] = objData.annotation[i].imageUrl;
    }

    var annotation = ffmpeg(sourcePath);
    annotationVideos.forEach(function (url) {
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
          enable: `between(t,${objData.annotation[i].startTime},${objData.annotation[i].endTime})`,
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
        .videoCodec("libx264")
        // .outputOptions("-pix_fmt yuv420p")
        .output(outputPath)
        .on("progress", function (progres) {
          console.log("... frames :- " + progres.frames);
        })
        .on("end", async function (err) {
          if (!err) {
            console.log("conversion Done");
            let videoObj = {
              userId: id,
              filename: filename,
              url: outputPath,
              formate: "video/mp4",
              editType: "annotation",
            };
            var video = await videoModel.findOne({
              where: { Id: objData.videoId, editType: "annotation" },
            });
            if (video) {
              await videoModel.update(videoObj, {
                where: { Id: objData.videoId },
              });
              // let rootPath = Path.join(__dirname, "../../");
              // video.url = Path.join(rootPath, video.url);
              resolve(video);
            } else {
              let video = await videoModel.create(videoObj);
              // if (video) {
              //   let rootPath = Path.join(__dirname, "../../");
              //   video.url = Path.join(rootPath, video.url);
              // }
              resolve(video);
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

const mergeByGroupId = async (id, decodeId) => {
  return await new Promise(async (resolve, reject) => {
    let videoData = await videoModel.findAll({
      where: { groupId: id.groupId },
      attributes: ["url"],
    });
    let urls = [];
    for (let i = 0; i < videoData.length; i++) {
      urls[i] = videoData[i].url;
    }

    for (var i = 0; i < urls.length; i++) {
      let tempFilename1 = `${Date.now()}_pixel.mp4`;
      let outputPth = `public/videos/tempVideos/${tempFilename1}`;
      ffmpeg(urls[i])
        .setFfmpegPath(ffmpegInstaller.path)
        .output(outputPth)
        .videoCodec("libx264")
        .withSize(`${id.width}x${id.height}`)
        .applyAutopadding(true, "black")
        .on("error", function (err) {
          console.log("An error occured :- " + err);
        })
        .on("progress", function (progres) {
          console.log("... frames :- " + progres.frames);
        })
        .on("end", function () {
          console.log("now please wait.....merge will start ....soon");
        })
        .run();
    }

    setTimeout(async function () {
      const rootFolder = Path.join(
        __dirname,
        "../../public/videos/tempVideos/"
      );
      await readdir(rootFolder);

      await videoModel.findOne({
        order: [["userId", "DESC"]],
        attributes: ["userId"],
      });
      let tempFilename = `${Date.now()}-user-${decodeId}.mp4`;
      let filename = `public/videos/mergedVideos/${tempFilename}`;
      // let mergedVideoFilepath = Path.join("mergedVideos", tempFilename);
      var mergedVideo = ffmpeg();

      videoNames.forEach(function (url) {
        mergedVideo = mergedVideo.addInput(url);
      });

      mergedVideo
        .setFfmpegPath(ffmpegInstaller.path)
        .on("progress", function (progress) {
          console.log("Merging :- " + Math.floor(progress.percent));
        })
        .on("error", function (error) {
          const directory = "public/videos/tempVideos";
          fs.readdir(directory, (err, files) => {
            if (err) reject(err);
            for (const file of files) {
              fs.unlink(Path.join(directory, file), (err) => {
                if (err) throw err;
              });
            }
            console.log("An error occurred: " + error.message);
            reject(error);
          });
        })
        .on("end", async function () {
          console.log("Merging finished !");
          const directory = "public/videos/tempVideos";
          fs.readdir(directory, (err, files) => {
            if (err) reject(err);
            for (const file of files) {
              fs.unlink(Path.join(directory, file), (err) => {
                if (err) throw err;
              });
            }
          });
          var videoObj = {
            userId: decodeId,
            filename: `${tempFilename}`,
            url: `${filename}`,
            formate: "video/mp4",
            editType: "merge",
          };
          var video = await videoModel.findOne({
            where: { Id: id.videoId, editType: "merge" },
          });
          if (video) {
            await videoModel.update(videoObj, { where: { Id: id.videoId } });
            // let rootPath = Path.join(__dirname, "../../");
            // video.url = Path.join(rootPath, video.url);
            resolve(video);
          } else {
            let video = await videoModel.create(videoObj);
            // if (video) {
            //   let rootPath = Path.join(__dirname, "../../");
            //   video.url = Path.join(rootPath, video.url);
            // }
            resolve(video);
          }
        })
        .mergeToFile(`${filename}`);
    }, 50000);
  });
};

const addStrings = async (bodyData, id) => {
  return await new Promise(async (resolve, reject) => {
    await videoModel.findOne({
      order: [["groupId", "DESC"]],
      attributes: ["groupId"],
    });
    let filename = bodyData.video.filename + `-user-${id}.mp4`;
    let sourcePath = bodyData.video.sourcePath;
    let outputPath = `public/videos/subtitlesVideo/${filename}`;

    let array = [];
    for (let i = 0; i < bodyData.string.length; i++) {
      array.push({
        filter: "drawtext",
        options: {
          fontfile: "Lucida Grande.ttf",
          fontsize: `${bodyData.string[i].fontsize}`,
          fontcolor: `${bodyData.string[i].fontcolor}`,
          text: `${bodyData.string[i].text}`,
          enable: `between(t,${bodyData.string[i].startTime},${bodyData.string[i].endTime})`,
          x: `${bodyData.string[i].scale_X}`,
          y: `${bodyData.string[i].scale_Y}`,
        },
      });
    }

    ffmpeg.ffprobe(sourcePath, (err, metaData) => {
      ffmpeg(sourcePath)
        .videoFilters(array)
        .videoCodec("libx264")
        // .outputOptions("-pix_fmt yuv420p")
        .output(outputPath)
        .on("progress", function (progres) {
          console.log("... frames :- " + progres.frames);
        })
        .on("end", async function (err) {
          if (!err) {
            console.log("conversion Done");
            let videoObj = {
              userId: id,
              filename: filename,
              url: outputPath,
              formate: "video/mp4",
              editType: "Text",
            };
            var video = await videoModel.findOne({
              where: { Id: bodyData.videoId, editType: "Text" },
            });
            if (video) {
              await videoModel.update(videoObj, {
                where: { Id: bodyData.videoId },
              });
              // let rootPath = Path.join(__dirname, "../../");
              // video.url = Path.join(rootPath, video.url);
              resolve(video);
            } else {
              let video = await videoModel.create(videoObj);
              // if (video) {
              //   let rootPath = Path.join(__dirname, "../../");
              //   video.url = Path.join(rootPath, video.url);
              // }
              resolve(video);
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

const annoStr = async (bodyData, id) => {
  return await new Promise(async (resolve, reject) => {
    await videoModel.findOne({
      order: [["groupId", "DESC"]],
      attributes: ["groupId"],
    });
    let filename = bodyData.project.video[0].filename + `-user-${id}.mp4`;
    let sourcePath = bodyData.project.video[0].path;
    let outputPath = `public/videos/tempVideos/${filename}`;

    let annotationVideos = [];
    for (var i = 0; i < bodyData.project.anotation.length; i++) {
      annotationVideos[i] = bodyData.project.anotation[i].imageUrl;
    }

    var annotation = ffmpeg(sourcePath);
    annotationVideos.forEach(function (url) {
      annotation = annotation.input(url);
    });

    let array = [];
    let input;
    for (let i = 0; i < bodyData.project.anotation.length; i++) {
      if (i === 0) {
        input = `[${i}:v]`;
      } else {
        input = "[temp]";
      }
      array.push({
        filter: "overlay",
        options: {
          enable: `between(t,${bodyData.project.anotation[i].videoTiming.startTime},${bodyData.project.anotation[i].videoTiming.endTime})`,
          x: `${bodyData.project.anotation[i].scale_X}`,
          y: `${bodyData.project.anotation[i].scale_Y}`,
        },
        inputs: `${input}[${i + 1}:v]`,
        outputs: "temp",
      });
    }
    
    ffmpeg.ffprobe(sourcePath, (err, metaData) => {
      annotation
        .complexFilter(array, "temp")
        .videoCodec("libx264")
        // .outputOptions("-pix_fmt yuv420p")
        .output(outputPath)
        .on("progress", function (progres) {
          console.log("... frames :- " + progres.frames);
        })
        .on("end", async function (err) {
          if (!err) {
            console.log("Please wait.............process is running");
          } else {
            console.log("conversion not done");
          }
        })
        .on("error", (error) => {
          const directory = "public/videos/tempVideos";
          fs.readdir(directory, (err, files) => {
            if (err) console.log(err);
            for (const file of files) {
              fs.unlink(Path.join(directory, file), (err) => {
                if (err) throw err;
              });
            }
            console.log("An error occurred: " + error.message);
          });
        })
        .run();
    });
    setTimeout(async function () {
      const rootFolder = Path.join(
        __dirname,
        "../../public/videos/tempVideos/"
      );
      await readdir(rootFolder);
      await videoModel.findOne({
        order: [["userId", "DESC"]],
        attributes: ["userId"],
      });
      let tempFilename = `${Date.now()}-user-${id}.mp4`;
      let filename = `public/videos/annotationWithStrVideos/${tempFilename}`;

      let array = [];
      for (let i = 0; i < bodyData.project.texts.length; i++) {
        array.push({
          filter: "drawtext",
          options: {
            fontfile: "Lucida Grande.ttf",
            fontsize: `${bodyData.project.texts[i].fontsize}`,
            fontcolor: `${bodyData.project.texts[i].fontcolor}`,
            text: `${bodyData.project.texts[i].text}`,
            enable: `between(t,${bodyData.project.texts[i].videoTiming.startTime},${bodyData.project.texts[i].videoTiming.endTime})`,
            x: `${bodyData.project.texts[i].scale_X}`,
            y: `${bodyData.project.texts[i].scale_Y}`,
          },
        });
      }
      ffmpeg.ffprobe(videoNames[0], (err, metaData) => {
        ffmpeg(videoNames[0])
          .videoFilters(array)
          .videoCodec("libx264")
          // .outputOptions("-pix_fmt yuv420p")
          .output(filename)
          .on("progress", function (progres) {
            console.log("... frames :- " + progres.frames);
          })
          .on("end", async function (err) {
            if (!err) {
              console.log("conversion Done");
              const directory = "public/videos/tempVideos";
              fs.readdir(directory, (err, files) => {
                if (err) console.log(err);
                for (const file of files) {
                  fs.unlink(Path.join(directory, file), (err) => {
                    if (err) throw err;
                  });
                }
              });
              let videoObj = {
                userId: id,
                filename: tempFilename,
                url: filename,
                formate: "video/mp4",
                editType: "Annotation + Text",
              };
              var video = await videoModel.findOne({
                where: { Id: bodyData.project.video[0].videoId },
              });
              if (video) {
                await videoModel.update(videoObj, {
                  where: { Id: bodyData.project.video[0].videoId },
                });
                // let rootPath = Path.join(__dirname, "../../");
                // video.url = Path.join(rootPath, video.url);
                let response = {
                  message: "Data successfully updated",
                }
                resolve(response);
              } else {
                let video = await videoModel.create(videoObj);
                // if (video) {
                //   let rootPath = Path.join(__dirname, "../../");
                //   video.url = Path.join(rootPath, video.url);
                // }
                resolve(video);
              }
            } else {
              console.log("conversion not done");
            }
          })
          .on("error", (err) => {console.log(err); reject();})
          .run();
      });
    }, 55000);
  });
};

async function readdir(filePath) {
  const rootFolder = Path.join(__dirname, "../../public/videos/tempVideos/");
  fs.readdir(filePath, (err, files) => {
    files.forEach((file) => {
      let filePath = Path.join(rootFolder, file);
      videoNames.push(`${filePath}`);
    });
    return videoNames;
  });
}

module.exports = {
  trim,
  merge,
  getVideoByUser,
  annotation,
  mergeByGroupId,
  addStrings,
  annoStr,
};
