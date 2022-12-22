const Sequelize = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const dbName = process.env.DBNAME;
const database = process.env.DATABASE;
const password = process.env.PASSWORD;
const localhost = process.env.LOCALHOST;
const dialect = process.env.DIALECT;

const sequelize = new Sequelize(dbName, database, password, {
  host: localhost,
  dialect: dialect,
  pool: { max: 5, min: 0, idle: 10000 },
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Database successfully connected");
  })
  .catch((err) => {
    console.log("Error" + err);
  });

module.exports = sequelize;
