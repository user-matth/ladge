FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --force

COPY . .

RUN npm run build

EXPOSE 4200

CMD ["npm", "start"]

