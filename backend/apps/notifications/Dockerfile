FROM node:alpine as development

WORKDIR /usr/src/app

COPY package.json ./ 

COPY yarn.lock ./

COPY tsconfig.json tsconfig.json

RUN which yarn || npm install -g yarn

RUN yarn install


COPY apps/notifications apps/notifications
COPY libs libs

RUN cd apps/notifications && yarn install

RUN yarn run build

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

CMD ["node", "dist/apps/notifications/main"]