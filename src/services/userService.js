const User = require("../models/users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const inputData = async (bodyData) => {
  let password = bodyData.Password;
  const salt = await bcrypt.genSalt(10);
  password = await bcrypt.hash(password, salt);
  let data = await User.create({
    roleId: bodyData.RoleId,
    name: bodyData.Name,
    email: bodyData.Email,
    phone: bodyData.Phone,
    password: password,
  });
  return data;
};

const getUserByUser = async (getUserById) => {
  return await new Promise(async (resolve, reject) => {
    await User.findAll({
      where: { Id: getUserById.id, roleId: getUserById.RoleId },
    })
      .then((data) => {
        resolve(data);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

const userLogin = async (bodyData) => {
  return await new Promise(async (resolve, reject) => {
    let token = "";
    let response = {};
    await User
      .findOne({
        where: {
          email: bodyData.Email,
        },
      })
      .then(async (data) => {
        if (bodyData.Email == "" && bodyData.Password == "") {
          response = {
            message: "Please enter email and password",
          };
        } else if (bodyData.Password == "") {
          response = {
            message: "Please enter password",
          };
        } else if (bodyData.Email == "") {
          response = {
            message: "Please enter email",
          };
        } else if (data) {
          const hashPassword = data.password;
          await bcrypt.compare(bodyData.Password, hashPassword)
            .then((result) => {
              if (result) {
                token = jwt.sign(
                  {
                    Id: data.Id,
                    RoleId: data.roleId,
                    Name: data.name,
                    Email: data.email,
                    Password: data.password,
                  },
                  "secret"
                );
                response = {
                  message: "Login successfully",
                  UserToken: token,
                  UserData: {
                    Id: data.Id,
                    RoleId: data.roleId,
                    Name: data.name,
                  },
                };
              } else {
                response = {
                  message: "Password is incorrect",
                };
              }
            })
            .catch((err) => {
              console.log(err, "=== err ===");
              reject();
            });
        } else {
          response = {
            message: "Invalid email",
          };
        }
      })
      .catch((error) => {
        console.error(error, "error+++");
        reject();
      });
    resolve(response);
  })
}

module.exports = { inputData, getUserByUser, userLogin };
