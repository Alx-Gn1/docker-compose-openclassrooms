# Compilation de mes projets de formation OpenClassrooms

J'ai regroupé tous mes projets openclassrooms en 1 docker compose qui exécute les serveurs & applications frontend des projets :
mon-vieux-grimoire : https://github.com/Alx-Gn1/mon-vieux-grimoire
portfolio-sophie-bluel : https://github.com/Alx-Gn1/PortfolioArchitecteInterieur
images & assets pour mon portfolio : https://github.com/Alx-Gn1/portfolio-2023

## lancement :

```bash
docker-compose build
docker-compose up
```

Il est également possible de lancer chaque projet individuellement à l'aide d'un fichier docker-compose présent dans chaque projet

exemple :
Pour exécuter le projet Mon Vieux Grimoire
```bash
cd mon-vieux-grimoire
docker-compose build
docker-compose up
```
