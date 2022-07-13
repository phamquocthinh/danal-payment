FROM node:14

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --no-cache

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:dev"]