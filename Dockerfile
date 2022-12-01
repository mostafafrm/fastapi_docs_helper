FROM node:lts-alpine AS base
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY build.js ./
