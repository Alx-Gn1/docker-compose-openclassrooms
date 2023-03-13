const express = require("express");
const booksRoutes = require("./routes/books");
const userRoutes = require("./routes/user");
const path = require("path");
const helmet = require("helmet");
const connectToMongoDB = require("./utils/functions/connectToMongoDB");
const setDefaultHeaders = require("./utils/functions/setDefaultHeaders");
const { apiLimiter, authLimiter } = require("./utils/functions/rateLimits");

// Utilisation de dotenv pour stocker la clé de chiffrement jsonWebToken
require("dotenv").config();

// Connection mongoDB
connectToMongoDB();

// App
const app = express();
app.use(express.json());

// Sécurités
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use((req, res, next) => {
  setDefaultHeaders(res);
  next();
});

// Routes de l'application
app.use("/api/books", apiLimiter, booksRoutes);
app.use("/api/auth", authLimiter, userRoutes);
app.use("/images", apiLimiter, express.static(path.join(__dirname, "images")));

module.exports = app;
