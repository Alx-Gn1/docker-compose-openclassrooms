const express = require("express");
const router = express.Router();
const Book = require("../models/Book");
const auth = require("../middleware/auth");
const bookCtrl = require("../controllers/book");
const multer = require("../middleware/multer-config");
const { bookIdIsValid, bookIsValid } = require("../middleware/bookValidator");

// Routes pour les modifications sur les livres
router.get("/", bookCtrl.getAllBooks);
router.get("/bestrating", bookCtrl.getBestBooks);
router.get("/:id", bookIdIsValid, bookCtrl.getOneBook);
router.post("/", auth, bookIsValid, multer, bookCtrl.createBook);
router.put("/:id", bookIdIsValid, bookIsValid, auth, multer, bookCtrl.modifyBook);
router.delete("/:id", bookIdIsValid, auth, bookCtrl.deleteBook);
router.post("/:id/rating", bookIdIsValid, auth, bookCtrl.addRating);

module.exports = router;
