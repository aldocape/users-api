const { list } = require("../../database");
const database = require("../../database");
const requestHandler = require("../../middlewares/requestHandler");

// GET /api/users

module.exports = (route) => {
  route.get(
    "/",
    requestHandler(async (req, res) => {
      const filterName = req.query.filterName;

      // let users = database.DB;

      // if (filterName) {
      //   users = users.filter((elem) => elem.name.includes(filterName));
      // }

      // database.listOrdered(users);

      const users = await database.list(filterName);
      res.json(users);
    })
  );
};
