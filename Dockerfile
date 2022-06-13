FROM node:16.14-alpine

WORKDIR /src/app

COPY package*json ./

RUN npm install

COPY . .

CMD ["npm","run","start"]

