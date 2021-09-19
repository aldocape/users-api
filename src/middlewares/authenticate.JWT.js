const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

const authenticateJWT = (req, res, next) => {
  // authHeader = "Bearer {JWT}"
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const [bearer, jswtoken] = authHeader.split(" ");

    jwt.verify(jswtoken, JWT_SECRET, (err, session) => {
      if (err) {
        res.sendStatus(403);
      }

      req.session = session;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

module.exports = authenticateJWT;
