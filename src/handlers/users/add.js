const database = require("../../database");

const validateName = require("../../validations/user/validateName");
const validateAge = require("../../validations/user/validateAge");
const validateErrors = require("../../validations/validateErrors");
const requestHandler = require("../../middlewares/requestHandler");

// POST /api/users

module.exports = (route) => {
  route.post(
    "/",
    validateName,
    validateAge,
    validateErrors,
    requestHandler(async (req, res) => {
      const user = {
        name: req.body.name,
        age: req.body.age,
        username: req.body.username,
        password: req.body.password,
      };

      // const userName = user.name.toLowerCase().trim();

      const user_exists = await database.findByUsername(user.username);

      if (user_exists) {
        res.status(409).json({
          message: "El nombre de usuario ya existe",
        });
      } else {
        await database.add(user);
        res.json(user);
      }
    })
  );
};

// function validateUser(name, age) {
//   const errors = [];

//   if (!name) {
//     errors.push({
//       field: "name",
//       message: "Campo requerido",
//     });
//   } else {
//     if (name.length < 3) {
//       errors.push({
//         field: "name",
//         message: "El nombre de usuario debe tener por lo menos 3 caracteres",
//       });
//     }
//   }

//   if (!age) {
//     errors.push({
//       field: "age",
//       message: "Campo requerido",
//     });
//   }

//   return errors;
// }
