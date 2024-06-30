FROM node:alpine as development
WORKDIR /usr/src/app

COPY package.json yarn.lock tsconfig.json nest-cli.json ./

RUN yarn install

COPY apps/transaction apps/transaction
COPY libs libs

RUN cd apps/transaction && yarn install

RUN yarn run build transaction

FROM node:alpine as production

ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN npm ci --only=production

COPY --from=development /usr/src/app/dist ./dist

RUN addgroup app && adduser -S -G app app
USER app

CMD ["node", "dist/apps/transaction/main"]