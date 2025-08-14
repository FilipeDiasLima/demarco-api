# Dockerfile para desenvolvimento
FROM node:18-alpine

# Instalar dependências do sistema
RUN apk add --no-cache bash

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar todas as dependências (incluindo devDependencies)
RUN npm ci

# Copiar código fonte
COPY . .

# Expor a porta da aplicação
EXPOSE 3333

# Comando padrão (pode ser sobrescrito no docker-compose)
CMD ["npm", "run", "start:dev"]
