const express = require("express");
const imageController = require("../controllers/imageController");
const mw = require("../middleware/authorization");

const router = express.Router();

router.get("/getImage", mw.authentication, imageController.getImage);
router.post("/annotation", mw.authentication, imageController.annotation);

module.exports = router;
