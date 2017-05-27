FROM node:latest

RUN mkdir -p /usr/geobork
WORKDIR /usr/geobork

COPY package.json /usr/geobork
RUN npm install
COPY . /usr/geobork

ENV PORT 3000
EXPOSE $PORT

CMD ["npm", "start"]
