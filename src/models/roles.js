const { DataTypes } = require("sequelize");
const sequelize = require("../config/dbconfig");
const User = require("./users");

const Role = sequelize.define(
  "role",
  {
    Id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    }
  },
  {
    createdAt: "Created_Date",
    updatedAt: "Updated_Date",
  }
);

Role.hasMany(User, {foreignKey: "roleId"});
User.belongsTo(Role, {foreignKey: "Id"});

Role.sync({ force: false });

module.exports = Role;
