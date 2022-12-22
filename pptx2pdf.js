const document = require("file-convert");

const options = {
  libreofficeBin: "C:/Program Files/LibreOffice/program/soffice.exe",
  sourceFile: "./my.pptx", // .ppt, .pptx, .odp, .key and .pdf
  outputDir: "public/others",
  img: false,
  imgExt: "jpg", // Optional and default value png
  reSize: 800, //  Optional and default Resize is 1200
  density: 120, //  Optional and default density value is 120
  disableExtensionCheck: true, // convert any files to pdf or/and image
};

// Convert document to pdf and/or image
document
  .convert(options)
  .then((res) => {
    console.log("res", res); // Success or Error
  })
  .catch((e) => {
    console.log("e", e);
  });