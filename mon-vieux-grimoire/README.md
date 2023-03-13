# Mon Vieux Grimoire

Un site de libraire qui sert pour le référencement et la notation de livres

Application réalisée en stack MERN (MongoDB, ExpressJS, ReactJS, NodeJS)

ATTENTION :
Il manque le fichier ".env" dans le dossier "backend" (pour des raisons de sécurité)
Celui ci contient 2 variables :

- jsonWebToken_PRIVATE = un string qui sert de private key pour jsonWebToken
- MONGODB_URL = l'url de connection à mongoDB, au format :

mongodb+srv://"username":"password"@"cluster".mongodb.net/?retryWrites=true&w=majority

## Installation & Lancement

ReactJS :

```bash
  cd frontend
  npm i
  npm start
```

ExpressJS :

```bash
  cd backend
  npm i
  npm start
```
