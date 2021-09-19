const database = require("../../database");
const requestHandler = require("../../middlewares/requestHandler");

// GET /api/users/:userId

module.exports = (route) => {
  route.get(
    "/:userId",
    requestHandler(async (req, res) => {
      const userId = parseInt(req.params.userId);
      const user = await database.findById(userId);

      if (user) {
        res.json(user);
      } else {
        res.sendStatus(404);
      }
    })
  );
};
