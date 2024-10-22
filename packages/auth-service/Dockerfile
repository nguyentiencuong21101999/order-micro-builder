# build-stage
FROM node:18-alpine as common-build-stage
 
WORKDIR /app
 
COPY package.json yarn.lock ./
RUN yarn install
 
# final-stage
FROM node:18-alpine
COPY --from=common-build-stage /app .
 
 
COPY . .
RUN yarn build
 
EXPOSE 4000
 
CMD yarn start-vps-dev


