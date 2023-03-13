const mongoose = require("mongoose");

// Fonction pour se connecter à MongoDB avec mongoose, executée au lancement du server
module.exports = () => {
  mongoose.set("strictQuery", false);
  mongoose
    .connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connexion à MongoDB réussie !"))
    .catch(() => console.log("Connexion à MongoDB échouée !"));
};
