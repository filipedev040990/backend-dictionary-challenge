FROM node:22.14.0

WORKDIR /app

COPY package*.json ./

RUN npm install --loglevel verbose --legacy-peer-deps

RUN apt-get update

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "start" ]