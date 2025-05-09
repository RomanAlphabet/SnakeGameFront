FROM node:latest

#ENTRYPOINT ["top", "-b"]

WORKDIR /app

COPY package*.json ./

RUN npm ci

RUN npm install -g @angular/cli

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--configuration=production", "--host", "0.0.0.0"]
