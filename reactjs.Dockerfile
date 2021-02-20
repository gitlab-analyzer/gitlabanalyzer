FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# install app dependencies
COPY client/package.json ./
COPY client/package-lock.json ./
RUN npm install
# RUN npm install react-scripts@3.4.1 -g --silent

# add app
COPY ./client .

EXPOSE 6789

# start app
CMD npm start

# FROM node:14.9

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm install

# COPY . .

# EXPOSE 5000

# CMD [ "npm", "start" ]