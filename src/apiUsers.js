const express = require("express");
const database = require("./database");

const usersAPI = express.Router();

usersAPI.get("/", (req, res) => {
  database.listOrdered();
  res.json(database.DB);
});

usersAPI.post("/", (req, res) => {
  const name = req.body.name;
  const age = req.body.age;

  const user = {
    name: name.trim(),
    age: parseInt(age),
  };

  database.add(user);
  res.json(user);
});

usersAPI.put("/", (req, res) => {
  const name = req.body.name;
  const age = req.body.age;

  const user = {
    userId: req.body.userId,
    name: name.trim(),
    age: parseInt(age),
  };

  database.update(user);
  res.json(user);
});

usersAPI.delete("/:userId", (req, res) => {
  const userId = parseInt(req.params.userId);

  if (database.remove(userId)) {
    res.json({
      message: "User deleted!",
    });
  } else {
    res.sendStatus(404);
  }
});

module.exports = usersAPI;
