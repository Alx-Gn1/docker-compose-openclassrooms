const Joi = require("joi");

exports.bookIdIsValid = (req, res, next) => {
  const bookIdSchema = Joi.object({ id: Joi.string().alphanum() });
  if (!bookIdSchema.validate({ id: req.params.id })) {
    res.status(400).json({ error: "invalid Id" });
  } else {
    next();
  }
};

exports.bookIsValid = (req, res, next) => {
  const bookSchema = Joi.object({
    userId: Joi.string().alphanum(),
    title: Joi.string().max(64).required(),
    author: Joi.string().alphanum().max(32).required(),
    year: Joi.number().integer().required(),
    genre: Joi.string().alphanum().max(32).required(),
    ratings: Joi.array()
      .items(Joi.object({ userId: Joi.string().alphanum(), grade: Joi.number().integer() }))
      .required(),
    averageRating: Joi.number().required(),
    imageURL: Joi.string(),
  });
  const bookObj = req.file
    ? {
        ...JSON.parse(req.body.book),
        imageURL: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
      }
    : { ...req.body };
  if (!bookSchema.validate(bookObj)) {
    res.status(400).json({ error: "invalid book" });
  } else {
    next();
  }
};
