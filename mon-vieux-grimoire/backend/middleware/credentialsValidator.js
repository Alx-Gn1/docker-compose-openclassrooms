const validator = require("email-validator");
const passwordValidator = require("password-validator");
const Joi = require("joi");
const credentialsSchema = Joi.object({
  password: Joi.string().alphanum().min(6).max(32).required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ["com", "net", "org", "fr"] } }).required(),
});

/**
 * Valide l'email à l'aide du package npm email-validator et de Joi
 */
exports.emailValidator = (req, res, next) => {
  if (!credentialsSchema.validate({ password: req.body.password, email: req.body.email }))
    res.status(400).json({ error: "Mot de passe/Email invalide" });
  validator.validate(req.body.email)
    ? next()
    : res.status(400).json({ message: "Erreur : L'adresse email rentrée n'existe pas" });
};

/**
 * Vérifie le schema mdp avec Joi puis valide le mot de passe avec le package password-validator
 */
exports.passwordValidator = (req, res, next) => {
  if (!credentialsSchema.validate({ password: req.body.password, email: req.body.email }))
    res.status(400).json({ error: "Mot de passe/Email invalide" });
  const schema = new passwordValidator();
  schema
    .is()
    .min(6, "Le mot de passe doit faire 6 caractères minimum")
    .is()
    .max(32, "Le mot de passe ne doit pas dépasser 32 caractères")
    .has()
    .uppercase(1, "Le mot de passe doit contenir une lettre majuscule au minimum")
    .has()
    .lowercase(1, "Le mot de passe doit contenir une lettre minuscule au minimum")
    .has()
    .digits(2, "Le mot de passe doit contenir 2 nombres minimum")
    .has()
    .not()
    .spaces(1, "Le mot de passe ne peut pas contenir d'espace");

  const validate = schema.validate(req.body.password, { details: true });

  // Avec l'argument {details:true} la fonction validate renvoie un array de tous les test qui ont échoués
  // Si aucun n'a échoué on va au middleware suivant, sinon on renvoie ce qui ne va pas dans le mdp
  if (validate.length === 0) {
    next();
  } else {
    res.status(400).json({ message: `Erreur : ${validate[0].message}` });
  }
};
