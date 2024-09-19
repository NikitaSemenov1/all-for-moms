FROM node:20.11.0 as builder

# Should be development or production
ARG ENV

WORKDIR /app
COPY . .
RUN npm install

RUN npm run build

EXPOSE 4173


CMD [ "npm", "run", "preview" ]
