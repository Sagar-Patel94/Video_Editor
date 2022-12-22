const express = require("express");
const mw = require("../middleware/authorization");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/login", userController.login);
router.post("/createUser", userController.createData);
router.get("/findUser", mw.authentication, userController.findUser);

module.exports = router;
