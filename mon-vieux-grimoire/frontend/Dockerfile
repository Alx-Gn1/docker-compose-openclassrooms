# syntax=docker/dockerfile:1

# Article pour choisir/comparer les versions d'images : https://snyk.io/blog/choosing-the-best-node-js-docker-image/
# https://hub.docker.com/layers/library/node/lts-alpine3.16/images/sha256-458133c0915bcc120f2af5fa1b23c73a5e2315209bd0a231ad7d60d4272011a5?context=explore
# 0 vulnérabilités détectés en mars 2023
FROM node:lts-alpine3.16 AS development

# Il faut créer un directory pour utiliser des commandes
WORKDIR /app

# Syntaxe : "COPY src dest"
# Copie tous les fichiers de l'app vers le WORKDIR
COPY . .

# Installe node_module dans le WORKDIR
# npm clean-install
RUN npm ci

# Génère un build de l'app
RUN npm run build

# Expose the port the app runs in
EXPOSE 3000

# CMD ["executable","param1","param2"] https://docs.docker.com/engine/reference/builder/#cmd
CMD [ "npx", "serve", "build" ]

# # Lance l'app avec nginx
# FROM nginx:stable as production
# ENV NODE_ENV production

# # copie le build vers nginx
# COPY --from=builder /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["npx","nginx", "-g", "daemon off;"]
