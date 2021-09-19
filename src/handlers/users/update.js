const database = require("../../database");

const validateName = require("../../validations/user/validateName");
const validateAge = require("../../validations/user/validateAge");
const validateErrors = require("../../validations/validateErrors");
const requestHandler = require("../../middlewares/requestHandler");

// PUT /api/users/:userId

module.exports = (route) => {
  route.put(
    "/:userId",
    validateName,
    validateAge,
    validateErrors,
    requestHandler(async (req, res) => {
      const name = req.body.name;
      const age = req.body.age;
      const username = req.body.username;
      const password = req.body.password;

      const user = await database.update(parseInt(req.params.userId), {
        name: name.trim(),
        age: parseInt(age),
        username,
        password,
      });
      res.json(user);
    })
  );
};
