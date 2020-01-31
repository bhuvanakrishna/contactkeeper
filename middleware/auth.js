const jwt = require("jsonwebtoken");
const config = require("config");

//we call next everytime we use a middleware, so it moves to next code
module.exports = function(req, res, next) {
  //get token header
  const token = req.header("x-auth-token");

  if (!token) {
    //401 code for unauthorized access
    return res.status(401).json({ msg: "no token, authorization denied" });
  }

  try {
    //remember we compare with secret
    const decoded = jwt.verify(token, config.get("jwtSecret"));
    //putting the user in the req, so that the user has access to the protected routes
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "token is not valid" });
  }
};
