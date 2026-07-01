# ---------- Stage 1: Dependencies ----------
FROM node:22.12.0-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

# Install only production dependencies for the final image
RUN npm ci --omit=dev && npm cache clean --force


# ---------- Stage 2: Production ----------
FROM node:22.12.0-alpine AS production

LABEL maintainer="Muskaan Mahajan <mmahajan11@myseneca.ca>"
LABEL description="Fragments node.js microservice"

ENV PORT=8080
ENV NODE_ENV=production
ENV NPM_CONFIG_LOGLEVEL=warn
ENV NPM_CONFIG_COLOR=false

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY package*.json ./
COPY ./src ./src

EXPOSE 8080

# Run as the non-root node user provided by the official Node image
USER node

CMD ["npm", "start"]