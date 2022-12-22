const fs = require("fs");
const groupdocs_conversion_cloud = require("groupdocs-conversion-cloud");

const convert = async () => {
  global.clientId = "da0c487d-c1c0-45ae-b7bf-43eaf53c5ad5";
  global.clientSecret = "479db2b01dcb93a3d4d20efb16dea971";
  global.myStorage = "";

  const config = new groupdocs_conversion_cloud.Configuration(
    clientId,
    clientSecret
  );
  config.apiBaseUrl = "https://api.groupdocs.cloud";

  let convertApi = groupdocs_conversion_cloud.ConvertApi.fromKeys(
    clientId,
    clientSecret
  );

  let file = fs.readFileSync("./Invoice_Page_1.pdf");

  let request = new groupdocs_conversion_cloud.ConvertDocumentDirectRequest(
    "pptx",
    file
  );

  let result = await convertApi.convertDocumentDirect(request);

  fs.writeFile("./temp.pptx", result, "binary", function (err) {});
};
convert();
