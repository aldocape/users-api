const express = require("express");

const usersRouting = express.Router();

const add = require("./add");
const list = require("./list");
const remove = require("./remove");
const show = require("./show");
const update = require("./update");

add(usersRouting);
list(usersRouting);
remove(usersRouting);
show(usersRouting);
update(usersRouting);

const usersAPI = express.Router();

usersAPI.use("/users", usersRouting);
module.exports = usersAPI;
