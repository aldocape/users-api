const database = require("../../database");
const requestHandler = require("../../middlewares/requestHandler");

// DELETE /api/users/:userId
module.exports = (route) => {
  route.delete(
    "/:userId",
    requestHandler(async (req, res) => {
      const userId = parseInt(req.params.userId);

      await database.remove(userId);

      res.json({
        message: "User deleted!",
      });
    })
  );
};
