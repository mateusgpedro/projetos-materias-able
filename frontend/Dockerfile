# Import project phase
FROM node:20-alpine as builder

WORKDIR '/app'
COPY ./package.json ./
RUN npm install
COPY ./ ./
RUN npm run buil

# Build Project phase
FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html