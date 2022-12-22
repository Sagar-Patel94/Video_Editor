const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");

const Image = sequelize.define(
  "image",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "users",
        key: "Id",
      },
    },
    groupId: {
      type: DataTypes.INTEGER,
    },
    filename: {
      type: DataTypes.STRING,
    },
    url: {
      type: DataTypes.STRING,
    },
    formate: {
      type: DataTypes.STRING,
    },
    editType: {
      type: DataTypes.STRING,
    },
    position: {
      type: DataTypes.STRING,
    },
    symbols: {
      type: DataTypes.STRING,
    },
    annotation: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    details: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: "Created_Date",
    updatedAt: "Updated_Date",
  }
);

Image.sync({ force: false });

module.exports = Image;
