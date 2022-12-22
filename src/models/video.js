const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");

const Video = sequelize.define(
  "video",
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
    length: {
      type: DataTypes.STRING,
    },
    sequence: {
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
    clip: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: "Created_Date",
    updatedAt: "Updated_Date",
  }
);

Video.sync({ force: false });

module.exports = Video;
