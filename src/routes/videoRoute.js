const express = require("express");
const videoController = require("../controllers/videoController");
const mw = require("../middleware/authorization");

const router = express.Router();

router.post("/annotationString", mw.authentication, videoController.annotationString);
router.post("/trim", mw.authentication, videoController.trim);
router.post("/mergeById", mw.authentication, videoController.mergeById);
router.post("/merge", mw.authentication, videoController.merge);
router.post("/annotation", mw.authentication, videoController.annotation);
router.post("/strings", mw.authentication, videoController.strings);
router.get("/getVideo", mw.authentication, videoController.getVideo);

module.exports = router;
