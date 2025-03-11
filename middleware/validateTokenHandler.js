const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");

const validateToken = asyncHandler(async (req, res, next) => {
  let token;
  let authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }

  token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;  // ✅ Fix: Store decoded user in `req.user`
    console.log("Decoded User:", req.user);
    next();  // ✅ Ensure `next()` is only called once
  } catch (error) {
    res.status(401).json({ message: "Not authorized, token failed" });
    return;  // ✅ Fix: Stop execution to prevent multiple responses
  }
});

module.exports = validateToken;
