# syntax=docker/dockerfile:1

# https://welovedevs.com/fr/articles/docker-node-api/
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
# Expose the port the app runs in
EXPOSE 4000

# CMD ["executable","param1","param2"] https://docs.docker.com/engine/reference/builder/#cmd
CMD [ "npx", "nodemon", "server" ]

# # Lance l'app avec nginx
# FROM nginx:stable as production
# ENV NODE_ENV production

# # copie le build vers nginx
# COPY --from=builder /app/build /usr/share/nginx/html
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# EXPOSE 80

# CMD ["npx","nginx", "-g", "daemon off;"]
