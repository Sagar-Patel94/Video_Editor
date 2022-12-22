require("./src/config/dbconfig");
const express = require("express");
const bodyParser = require("body-parser");
const router = require("./src/routes/index");
const dotenv = require("dotenv");

dotenv.config();

const prt = process.env.PORT;

const app = express();

const port = process.env.PORT || prt;
app.use('/public', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
app.use(bodyParser.json());
app.use("/", router);

app.listen(port, () => {
  console.log(`Express is running at port at :- ${port}`);
});
