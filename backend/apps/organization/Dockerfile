FROM node:alpine as development

WORKDIR /usr/src/app

COPY package.json ./ 

COPY yarn.lock ./

COPY tsconfig.json tsconfig.json

COPY nest-cli.json nest-cli.json

RUN which yarn || npm install -g yarn

RUN yarn install

COPY apps/organization apps/organization
COPY libs libs

RUN cd apps/organization && yarn install

RUN yarn run build organization

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

CMD ["node", "dist/apps/organization/main"]