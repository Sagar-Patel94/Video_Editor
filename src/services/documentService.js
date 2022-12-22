const documentModel = require("../models/document");
const fs = require("fs");
const path = require("path");
const { PDFDocument } = require("pdf-lib");
const ffmpeg = require("fluent-ffmpeg");
const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const link = require("pdf-internal-link");
const document = require("file-convert");

ffmpeg.setFfmpegPath(ffmpegPath);

const splitPdf = async (documents, id) => {
  return await new Promise(async (resolve, reject) => {
    let allFiles = [];
    const splitPDF = async (pdfFilePath, outputDirectory) => {
      const data = await fs.promises.readFile(pdfFilePath);
      const readPdf = await PDFDocument.load(data);
      const { length } = readPdf.getPages();

      for (let i = 0, n = length; i < n; i += 1) {
        const writePdf = await PDFDocument.create();
        const [page] = await writePdf.copyPages(readPdf, [i]);
        writePdf.addPage(page);
        const bytes = await writePdf.save();
        const outputPath = path.join(
          outputDirectory,
          `Invoice_Page_${i + 1}.pdf`
        );
        await fs.promises.writeFile(outputPath, bytes);
        console.log(`Added ${outputPath}`);
        let filename = `Invoice_Page_${i + 1}.pdf`;
        let documentObj = {
          userId: id,
          filename: filename,
          url: `public/docFiles/splitFiles/${filename}`,
          formate: "application/pdf",
          editType: "Split",
        };
        let document = await documentModel.create(documentObj);
        // if (document) {
        //   let rootPath = path.join(__dirname, "../../");
        //   document.url = path.join(rootPath, document.url);
        // }
        allFiles.push(document);
      }
    };

    splitPDF(documents.path, "public/docFiles/splitFiles/")
      .then(() => {
        console.log("All invoices have been split!");
        resolve(allFiles);
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
};

const annotationToPdf = async (bodyData, id) => {
  return await new Promise(async (resolve, reject) => {
    const annotation = async (pdfFilePath, outputDirectory) => {
      await documentModel.findOne({
        order: [["groupId", "DESC"]],
        attributes: ["groupId"],
      });

      const data = await fs.promises.readFile(pdfFilePath);
      const readPdf = await PDFDocument.load(data);
      const pages = readPdf.getPages();
      const selectPage = pages[bodyData.document.pageNumber - 1];

      for (var i = 0; i < bodyData.annotation.length; i++) {
        const imageBytes = await fs.promises.readFile(
          bodyData.annotation[i].url
        );
        const image = await readPdf.embedPng(imageBytes);
        const { width, height } = selectPage.getSize();
        image.scale(0.25);
        selectPage.drawImage(image, {
          x: bodyData.annotation[i].scale_X, // selectPage.getWidth() / 2 - width / 2
          y: bodyData.annotation[i].scale_Y, // selectPage.getHeight() / 2 - height / 2
        });
      }

      const pdfBytes = await readPdf.save();
      await fs.promises.writeFile(outputDirectory, pdfBytes);

      let documentObj = {
        userId: id,
        filename: filename,
        url: outputDirectory,
        formate: "application/pdf",
        editType: "split + annotation",
      };
      var document = await documentModel.findOne({
        where: { Id: bodyData.documentId },
      });
      if (document) {
        await documentModel.update(documentObj, {
          where: { Id: bodyData.documentId },
        });
        // let rootPath = path.join(__dirname, "../../");
        // document.url = path.join(rootPath, document.url);
      } else {
        let document = await documentModel.create(documentObj);
        // if (document) {
        //   let rootPath = path.join(__dirname, "../../");
        //   document.url = path.join(rootPath, document.url);
        // }
      }
      resolve(document);
    };

    let filename = Date.now() + `-user-${id}.pdf`;
    annotation(
      bodyData.document.sourcePath,
      `public/docFiles/annotationFiles/${filename}`
    )
      .then(() => {
        console.log("Conversion done!");
      })
      .catch((err) => {
        console.log(err);
        reject();
      });
  });
};

const audio_videoInPdf = async (bodyData, id) => {
  return await new Promise(async (resolve, reject) => {
    const tempFileName = Date.now() + `_user_${id}.pdf`;
    const inFile = bodyData.file;
    const outFile = `public/docFiles/audio_videoInFile/${tempFileName}`;
    const onPage = bodyData.pageNumber - 1;
    const toPage = 0;
    const x1 = bodyData.scale_X;
    const y1 = bodyData.scale_Y;
    const x2 = 0;
    const y2 = 0;
    const linkText = bodyData.audio_video_URL;
    const options = {
      color: bodyData.linkColor,
    };
    link(inFile, outFile, linkText, onPage, toPage, x1, y1, x2, y2, options);
    resolve(true);

    let documentObj = {
      userId: id,
      filename: tempFileName,
      url: outFile,
      formate: "application/pdf",
      editType: "audio_video URL",
    };
    var document = await documentModel.findOne({
      where: { Id: bodyData.documentId },
    });
    if (document) {
      await documentModel.update(documentObj, {
        where: { Id: bodyData.documentId },
      });
      // let rootPath = path.join(__dirname, "../../");
      // document.url = path.join(rootPath, document.url);
    } else {
      let document = await documentModel.create(documentObj);
      // if (document) {
      //   let rootPath = path.join(__dirname, "../../");
      //   document.url = path.join(rootPath, document.url);
      // }
    }
    resolve(document);
  });
};

const pptx_pdf = async (bodyData, id) => {
  return await new Promise(async (resolve, reject) => {
    let fileFolder = Date.now() + `_user_${id}`;
    const options = {
      libreofficeBin: "C:/Program Files/LibreOffice/program/soffice.exe",
      sourceFile: bodyData.ppt_path,
      outputDir: `public/docFiles/pptxToPdf/${fileFolder}`,
      img: false,
      imgExt: "jpg",
      reSize: 800,
      density: 120,
      disableExtensionCheck: true,
    };
    console.log("Please wait process is running.............")
    document
      .convert(options)
      .then((res) => {
        console.log("process is", res);
        resolve(true);
      })
      .catch((e) => {
        console.log("e", e);
        reject();
      });
  });
};

module.exports = { splitPdf, annotationToPdf, audio_videoInPdf, pptx_pdf };
