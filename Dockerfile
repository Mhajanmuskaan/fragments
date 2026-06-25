# ---------- Stage 1: Build ----------
FROM node:22.12.0 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY ./src ./src
COPY ./tests/.htpasswd ./tests/.htpasswd

# ---------- Stage 2: Production ----------
FROM node:22.12.0

LABEL maintainer="Muskaan Mahajan <mmahajan11@myseneca.ca>"
LABEL description="Fragments node.js microservice"

ENV PORT=8080
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/tests/.htpasswd ./tests/.htpasswd

EXPOSE 8080

CMD ["npm", "start"]