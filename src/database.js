const mysql = require("mysql2/promise");
const { DB_CONFIG } = require("./config");

let connection;

// let id = 1;

// const DB = [
//   {
//     userId: 1,
//     username: "aldocape",
//     password: "123456",
//     age: 38,
//   },
// ];

module.exports = {
  async initConnection() {
    connection = await mysql.createConnection(DB_CONFIG);
  },

  // DB,

  // ordenar() {
  //   DB.sort((a, b) => a.username - b.username);
  // },

  async add(user) {
    const { username, password, name, age } = user;

    const result = await connection.execute(
      "INSERT INTO users (username, password, name, age) VALUES (?, ?, ?, ?)",
      [username, password, name, age]
    );

    return await this.findById(result[0].insertId);
  },

  // add(user) {
  //   id++;
  //   user.userId = id;
  //   DB.push(user);
  // },

  // listOrdered(db) {
  //   //  Este método es para ordenar por nombre el array
  //   db.sort(function (a, b) {
  //     if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
  //     if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
  //     return 0;
  //   });
  // },

  async list(filterName) {
    /// método usando módulo mysql2

    let users = [];
    if (filterName === undefined) {
      filterName = "";
    }

    [users] = await connection.execute(
      `SELECT * FROM users WHERE name like "%${filterName}%" ORDER BY name`
    );

    return users;
  },

  async findById(userId) {
    // método usando el módulo mysql2
    const [users] = await connection.execute(
      "SELECT * FROM users WHERE id = ?",
      [userId]
    );
    if (users.length) {
      return users[0];
    } else {
      return undefined;
    }
  },

  // findById(userId) {
  //   // búsqueda por Id, usando Arrays
  //   const user = DB.find((item) => item.userId === userId);
  //   return user;
  // },

  async findByUsername(username) {
    // método usando el módulo mysql2
    const [user] = await connection.execute(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (user.length) {
      return user[0];
    } else {
      return 0;
    }
  },

  async findByUsernameAndPass(username, password) {
    // método usando el módulo mysql2
    const [user] = await connection.execute(
      "SELECT * FROM users WHERE username = ? AND PASSWORD = ?",
      [username, password]
    );
    if (user.length) {
      return user[0];
    } else {
      return undefined;
    }
  },

  // findByName(userName) {
  //   // Método que busca por nombre en el Array
  //   const user = DB.some(
  //     (item) => item.username.toLowerCase().trim() === userName
  //   );
  //   return user;
  // },

  // findByUsernameAndPass(userName, pass) {
  //   // Búsqueda por user and pass en array
  //   let user = null;
  //   DB.forEach((item) => {
  //     if (item.username === userName && item.password === pass) {
  //       user = item;
  //     }
  //   });
  //   return user;
  // },

  async remove(userId) {
    // Método para borrar un registro con el módulo mysql2
    const user = await this.findById(userId);

    if (!user) {
      throw new Error(`No existe un usuario con id "${userId}`);
    }

    await connection.execute("DELETE FROM users WHERE id = ?", [userId]);
  },

  async update(userId, newUserData) {
    // Método de actualización de datos de usuario, con el módulo mysql2
    const user = await this.findById(userId);

    if (!user) {
      throw new Error(`No existe un usuario con id "${userId}`);
    }

    if (newUserData.username) {
      user.username = newUserData.username;
    }

    if (newUserData.password) {
      user.password = newUserData.password;
    }

    user.name = newUserData.name;
    user.age = newUserData.age;

    await connection.execute(
      "UPDATE users SET name = ?, age = ?, username = ?, password = ? WHERE id = ?",
      [user.name, user.age, user.username, user.password, userId]
    );

    return user;
  },

  // update(user) {
  //   // Método update para Arrays, recibe un objeto user y modifica el elemento con el mismo id
  //   idToFind = user.userId;

  //   const userData = this.findById(idToFind);

  //   if (!userData) {
  //     return 0;
  //   }

  // Actualiza con la info que viene por parámetro

  //     userData.username = user.name;
  //     userData.age = user.age;

  //     return userData;
  //   },

  //   remove(idToFind) {
  //     // Método remove para uso en array, recibiendo por parámetro el id a eliminar
  //     const userIndex = DB.findIndex((item) => item.userId === idToFind);

  //     if (userIndex > -1) {
  //       DB.splice(userIndex, 1);
  //       return 1;
  //     } else {
  //       return 0;
  //     }
  //   },
};
