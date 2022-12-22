const documentService = require("../services/documentService");

let response;
const split = async (req, res) => {
  let id = res.locals.Id;
  let splitFile = await documentService.splitPdf(req.body, id);
  if (splitFile) {
    response = {
      message: "File successfully splited",
      status: 200,
      data: splitFile,
    };
  } else {
    response = {
      message: "Data not found",
      status: 200,
      data: null,
    };
  }
  return res.status(200).json(response);
};

const annotation = async (req, res) => {
  let id = res.locals.Id;
  let annotationFile = await documentService.annotationToPdf(req.body, id);
  if (annotationFile) {
    response = {
      message: "Annotation successfully added!",
      status: 200,
      data: annotationFile,
    };
  } else {
    response = {
      message: "Data not found",
      status: 200,
      data: null,
    };
  }
  return res.status(200).json(response);
}

const audio_videoToPdf = async (req, res) => {
  let id = res.locals.Id;
  let audio_videoToPdfFile = await documentService.audio_videoInPdf(req.body, id);
  if (audio_videoToPdfFile) {
    response = {
      message: "URL successfully added!",
      status: 200,
      url: req.body.audio_video_URL,
    };
  } else {
    response = {
      message: "Data not found",
      status: 200,
      data: null,
    };
  }
  return res.status(200).json(response);
}

const pptxTopdf = async (req, res) => {
  let id = res.locals.Id;
  console.log(req.body)
  let split_pptx = await documentService.pptx_pdf(req.body, id);
  if (split_pptx) {
    response = {
      message: "conversion done!",
      status: 200,
      data: null,
    };
  } else {
    response = {
      message: "Data not found",
      status: 200,
      data: null,
    };
  }
  return res.status(200).json(response);
}

module.exports = { split, annotation, audio_videoToPdf, pptxTopdf };
