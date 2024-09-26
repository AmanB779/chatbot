const rateLimit = require("express-rate-limit");

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 10, // limit each IP to 10 requests per 5min
  message: "Too many requests, please try again later!",
});

module.exports = limiter;
