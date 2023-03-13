const jwt = require("jsonwebtoken");
const Joi = require("joi");

const authSchema = Joi.object({ token: Joi.string(), userId: Joi.string().alphanum() });

/**
 * Vérifie que les token et id sont bien des string
 * Récupère le token de l'utilisateur, l'user Id associé, enregsitre l'id dans l'objet auth de la requête
 */
module.exports = (req, res, next) => {
  try {
    if (!authSchema.validate({ token: req.headers.authorization }))
      res.status(400).json({ error: "Invalid userId or userToken" });
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.jsonWebToken_PRIVATE);
    const userId = decodedToken.userId;
    if (!authSchema.validate({ userId })) res.status(400).json({ error: "Invalid userId or userToken" });
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: "Une erreur est survenue" });
  }
};
