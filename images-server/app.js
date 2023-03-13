const express = require("express");
const path = require("path");
const helmet = require("helmet");
const setDefaultHeaders = require("./utils/functions/setDefaultHeaders");
const { apiLimiter } = require("./utils/functions/rateLimits");

// App
const app = express();
// app.use(express.json());

// Sécurités
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use((req, res, next) => {
  setDefaultHeaders(res);
  next();
});

// Routes de l'application
app.use("/images", apiLimiter, express.static(path.join(__dirname, "images")));

module.exports = app;
