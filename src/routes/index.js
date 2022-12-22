const express = require("express");
const videoRoute = require("./videoRoute");
const imageRoute = require("./imageRoute");
const userRoute = require("./userRoute");
const fileRoute = require("./fileUploadRoute");
const roleRoute = require("./roleRoute");
const documentRoute = require("./documentRoute");

const app = express();

app.use("/files", fileRoute);
app.use("/video", videoRoute);
app.use("/image", imageRoute);
app.use("/user", userRoute);
app.use("/role", roleRoute);
app.use("/document", documentRoute);

module.exports = app;
