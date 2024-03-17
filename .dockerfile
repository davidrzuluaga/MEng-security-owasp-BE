FROM node:18.16.0-alpine AS node
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app
RUN npm set strict-ssl false
RUN npm install
RUN npm install -g nodemon
COPY . /usr/src/app
EXPOSE 5001
CMD [ "npm", "run", "dev" ]