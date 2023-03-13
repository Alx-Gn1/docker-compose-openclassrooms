const rateLimit = require("express-rate-limit");

// Limitations de requêtes vers l'api (routes book, téléchargement des images associées au livres)
exports.apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 1000,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
