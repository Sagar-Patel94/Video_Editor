const express = require("express");
const documentController = require("../controllers/documentController");
const mw = require("../middleware/authorization");

const router = express.Router();

router.post("/split", mw.authentication, documentController.split);
router.post("/annotation", mw.authentication, documentController.annotation);
router.post("/audio_videoToPdf", mw.authentication, documentController.audio_videoToPdf);
router.post("/pptxTopdf", mw.authentication, documentController.pptxTopdf);

module.exports = router;