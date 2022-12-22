const express = require("express");
const fileController = require("../controllers/fileUploadController");
const mw = require("../middleware/authorization");
const mwUpload = require("../middleware/uploadToLocal");

const router = express.Router();

router.post("/upload", mwUpload.fileUpload, mw.authentication, fileController.uploadFiles);

module.exports = router;
