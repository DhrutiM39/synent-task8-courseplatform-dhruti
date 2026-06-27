const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token;

  console.log("Authorization Header:", req.headers.authorization);

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      console.log("Extracted Token:", token);

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      console.log("Decoded Token:", decoded);

      req.user = decoded;

      next();
    } catch (error) {
      console.log("JWT Error:", error.message);

      return res.status(401).json({
        message: "Not authorized",
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "No token found",
    });
  }
};

module.exports = { protect };