const express = require("express");

const roleController = require("../controllers/roleController");

const router = express.Router();

router.post("/createRole", roleController.createData);

module.exports = router;
