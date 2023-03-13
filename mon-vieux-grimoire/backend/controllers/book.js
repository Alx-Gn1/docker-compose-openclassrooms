const Book = require("../models/Book");
const fs = require("fs");
const { ObjectId } = require("mongodb");

/** GET /api/books
 * Renvoie un tableau de tous les livres de la base de données.
 */
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: "Une erreur est survenue" });
    });
};

/** GET /api/books/:id
 * Renvoie le livre avec l’_id fourni.
 */
exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => res.status(200).json(book))
    .catch((error) => {
      console.log(error);
      res.status(404).json({ error: "Une erreur est survenue" });
    });
};
/** GET /api/books/bestarting
 * Renvoie un tableau des 3 livres de la base de
données ayant la meilleure note moyenne
 */
exports.getBestBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      books.sort((book1, book2) => book2.averageRating - book1.averageRating);
      res.status(200).json(books.slice(0, 3));
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: "Une erreur est survenue" });
    });
};
/** POST /api/books
 *   Capture et enregistre l'image, analyse le livre transformé en chaîne de caractères, et l'enregistre
 * dans la base de données en définissant correctement son ImageUrl.
 *   Initialise la note moyenne du livre à 0 et le rating avec un tableau vide. Remarquez que le corps de
 * la demande initiale est vide ; lorsque Multer est ajouté, il renvoie une chaîne pour le corps de la
 * demande en fonction des données soumises avec le fichier.
 */
exports.createBook = (req, res, next) => {
  const bookObj = JSON.parse(req.body.book);
  delete bookObj._id;
  delete bookObj.userId;
  const imageURL = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
  const book = new Book({
    userId: req.auth.userId,
    ...bookObj,
    imageURL,
  });
  book
    .save()
    .then(() => res.status(201).json({ message: "Le livre a bien été créé" }))
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: "Une erreur est survenue" });
    });
};
/**
 * PUT /api/books/:id
 *  Met à jour le livre avec l'_id fourni. Si une image est téléchargée, elle est capturée, et
 * l’ImageUrl du livre est mise à jour. Si aucun fichier n'est fourni, les informations sur le
 * livre se trouvent directement dans le corps de la requête (req.body.title, req.body.author, etc.).
 *  Si un fichier est fourni, le livre transformé en chaîne de caractères se trouve dans
 * req.body.book. Notez que le corps de la demande initiale est vide ; lorsque Multer est ajouté,
 * il renvoie une chaîne du corps de la demande basée sur les données soumises avec le fichier
 */
exports.modifyBook = (req, res, next) => {
  const bookObj = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageURL: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };
  delete bookObj._userId;
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {


        Book.updateOne({ _id: req.params.id }, { ...bookObj })
          .then(() => res.status(201).json({ message: "Le livre a été mis à jour" }))
          .catch((error) => {
            console.log(error);
            res.status(400).json({ error: "Une erreur est survenue" });
          });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: "Une erreur est survenue" });
    });
};
/**
 * DELETE /api/books/:id
 * Supprime le livre avec l'_id fourni ainsi que l’image associée.
 */
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId != req.auth.userId) {
        res.status(401).json({ message: "Not authorized" });
      } else {
        console.log("------------------------------------");
        const filename = book.imageURL.split("/images/")[1];

        fs.unlink(`images/${filename}`, () => {
          Book.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: "Le livre a été supprimé" }))
            .catch((error) => {
              console.log(error);
              res.status(400).json({ error: "Une erreur est survenue" });
            });
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json({ error: "Une erreur est survenue" });
    });
};
/**
 * POST /api/books/:id/rating
 * Définit la note pour le user ID fourni.
 * La note doit être comprise entre 0 et 5.
 * L'ID de l'utilisateur et la note doivent être ajoutés au tableau "rating" afin de ne pas laisser un
 * utilisateur noter deux fois le même livre. Il n’est pas possible de modifier une note.
 * La note moyenne "averageRating" doit être tenue à jour, et le livre renvoyé en réponse de la requête.
 */
exports.addRating = (req, res, next) => {
  const newRating = req.body;
  if (newRating.userId != req.auth.userId) {
    res.status(401).json({ message: "Not authorized" });
  }
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.ratings.find((rating) => rating.userId === newRating.userId)) {
        res.status(400).json({ error: "Vous avez déjà noté ce livre" });
      } else {
        const newBook = book;
        newBook.ratings.push({ userId: newRating.userId, grade: newRating.rating, _id: newRating._id });
        newBook.averageRating = calcAverageRating(book.ratings);

        Book.updateOne({ _id: req.params.id }, { ratings: newBook.ratings, averageRating: newBook.averageRating })
          .then(() => res.status(201).json(newBook))
          .catch((error) => {
            console.log(error);
            {
              console.log(error);
              res.status(400).json({ error: "Une erreur est survenue" });
            }
          });
      }
    })
    .catch((error) => {
      console.log(error);
      {
        console.log(error);
        res.status(400).json({ error: "Une erreur est survenue" });
      }
    });
};

/**
 * Fonction pour calculer la note moyenne d'un livre
 * @param {[{grade:Number}]} array
 */
function calcAverageRating(array) {
  let total = 0;
  for (let i = 0; i < array.length; i++) {
    total += Number(array[i].grade);
  }

  return parseFloat(total / array.length).toFixed(2);
}
