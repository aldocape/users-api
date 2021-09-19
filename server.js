const express = require("express");
const { PORT } = require("./src/config");
const { initConnection } = require("./src/database");

const app = express();

app.use(express.json());
app.use(express.static("./public"));

const usersAPI = require("./src/handlers");
app.use("/", usersAPI);

// const usersAPI = require("./src/apiUsers");
// app.use("/api/users", usersAPI);  Este middleware se usa para la usersAPI que está implementada sin uso de Routing

initConnection().then(() => {
  app.listen(PORT, () => {
    console.info(`Escuchando en el puerto ${PORT}`);
  });
});
