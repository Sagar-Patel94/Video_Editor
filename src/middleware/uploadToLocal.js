const multer = require("multer");

let fname, uploadPath;
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      fname = `${Date.now()}.png`;
      cb(null, fname);
    } else if (
      file.mimetype === "video/mp4" ||
      file.mimetype === "video/x-msvideo"
    ) {
      fname = `${Date.now()}.mp4`;
      cb(null, fname);
    } else if (
      file.mimetype === "application/pdf"
    ) {
      fname = `${Date.now()}.pdf`;
      cb(null, fname);
    } else if (
      file.mimetype === "audio/mpeg"
    ) {
      fname = `${Date.now()}.mp3`;
      cb(null, fname);
    } else if (
      file.mimetype === "application/vnd.openxmlformats-officedocument.presentationml.presentation"
    ) {
      fname = `${Date.now()}.pptx`;
      cb(null, fname);
    } else {
      fname = file.originalname;
      cb(null, fname);
    }
  },
});

const uploadFile = multer({
  storage: storage,
  fileFilter(req, file, cb) {
    req.body.video = false;
    req.body.image = false;
    req.body.document = false;
    req.body.audio = false;
    req.body.others = false;
    if (
      file.originalname.match(/\.(mp4)$/) ||
      file.originalname.match(/\.(avi)$/)
    ) {
      uploadPath = "public/videos/UploadedVideos/";
      req.body.video = true;
      req.body.filePath = uploadPath;
      cb(null, req.body);
    } else if (
      file.originalname.match(/\.(jpg)$/) ||
      file.originalname.match(/\.(png)$/) ||
      file.originalname.match(/\.(jpeg)$/)
    ) {
      req.body.image = true;
      uploadPath = "public/images/UploadedImages/";
      req.body.filePath = uploadPath;
      cb(null, req.body);
    } else if (file.originalname.match(/\.(pdf)$/) || file.originalname.match(/\.(pptx)$/)) {
      req.body.document = true;
      uploadPath = "public/docFiles/uploadFiles/";
      req.body.filePath = uploadPath;
      cb(null, req.body);
    } else if (file.originalname.match(/\.(mp3)$/)) {
      req.body.audio = true;
      uploadPath = "public/audios/uploadAudios/";
      req.body.filePath = uploadPath;
      cb(null, req.body);
    } else {
      req.body.others = true;
      uploadPath = "public/others/";
      req.body.filePath = uploadPath;
      cb(null, req.body);
    }
  },
});
let fileUpload = uploadFile.fields([
  { name: "file", maxCount: 50 },
  { name: "addImage", maxCount: 50 },
]);

module.exports = { fileUpload };