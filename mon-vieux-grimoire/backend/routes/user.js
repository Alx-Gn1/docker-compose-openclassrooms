const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const { emailValidator, passwordValidator } = require("../middleware/credentialsValidator");

// Routes pour la création de compte et authentification
router.post("/signup", emailValidator, passwordValidator, userCtrl.signup);
router.post("/login", emailValidator, passwordValidator, userCtrl.login);

module.exports = router;
