FROM node:alpine as development

WORKDIR /usr/src/app

COPY package.json ./ 

COPY yarn.lock ./

COPY tsconfig.json tsconfig.json

RUN which yarn || npm install -g yarn

RUN yarn install

RUN yarn add @nestjs/cli

COPY apps/transaction apps/transaction
COPY libs libs

RUN yarn run build transaction

FROM node:alpine as production

ARG NODE_ENV=production 
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package.json ./ 
COPY yarn.lock ./

RUN npm install -g yarn

RUN yarn install --prod
RUN yarn global add @nestjs/cli

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/transaction/main"]