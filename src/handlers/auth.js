const express = require("express");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const database = require("../database");
const requestHandler = require("../middlewares/requestHandler");

const authRouting = express.Router();

authRouting.post(
  "/login",
  requestHandler(async (req, res) => {
    const { name, password } = req.body;

    const user = await database.findByUsernameAndPass(name, password);

    if (user) {
      // Usuario válido
      const accessToken = jwt.sign(
        {
          name,
          id: user.id,
        },
        JWT_SECRET,
        {
          expiresIn: "30m",
        }
      );
      res.json({
        accessToken,
        status: "Logged in",
        id: user.id,
      });
    } else {
      // Usuario inválido
      res.status(401).json({
        error: "Usuario o contraseña incorrecto",
        status: "error",
      });
    }
  })
);

module.exports = authRouting;
