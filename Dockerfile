FROM node:22 AS build

COPY . /app/

WORKDIR /app/frontend/

RUN npm ci
RUN npm run build

WORKDIR /app/backend/

RUN npm ci

CMD npm run start