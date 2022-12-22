const jwt = require("jsonwebtoken");
const User = require("../models/users");
const Role = require("../models/roles");

const authentication = async (req, res, next) => {
  let token = req.get("authorization").split(" ")[1];
  jwt.verify(token, "secret", async function (err, decoded) {
    if (decoded) {
      let decode = jwt.decode(token);
      let data = await User.findByPk(decode.Id, {
        attributes: ["Id", "roleId", "name"],
        include: [
          {
            model: Role,
            attributes: ["Id", "name"],
          },
        ],
      });
      if (data.role.name == "Admin") {
        res.locals.Id = decode.Id;
        next();
      } else if (data.role.name == "User") {
        return res.status(200).json({ message: "You are not authorized user" });
      } else {
        return res.status(200).json({ message: "You are not admin or user" });
      }
    } else {
      return res.status(200).json({ message: "Invalid Token" });
    }
  });
};

module.exports = { authentication };
