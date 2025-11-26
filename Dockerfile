FROM node:14.17.3-alpine3.14

# Create app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY runtime .
COPY src .
COPY index.js .

EXPOSE 3000

CMD [ "node", "index.js" ]