FROM node:alpine as development
WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json nest-cli.json ./

RUN yarn install

COPY apps/notifications apps/notifications
COPY libs libs

RUN cd apps/notifications && yarn install

RUN yarn run build notifications

FROM node:alpine as production

ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN npm ci --only=production

COPY --from=development /usr/src/app/dist ./dist

RUN addgroup app && adduser -S -G app app
USER app

CMD ["node", "dist/apps/notifications/main"]