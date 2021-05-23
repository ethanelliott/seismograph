FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./
RUN yarn install --frozen-lockfile

ADD . /usr/src/app
RUN yarn lint
RUN yarn build

CMD [ "yarn", "start" ]
EXPOSE 8884
