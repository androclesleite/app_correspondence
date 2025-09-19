FROM node:22-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Limpar cache do npm
RUN npm cache clean --force

# Instalar dependências (incluindo devDependencies para Vite)
RUN npm ci

# Copiar código da aplicação
COPY . .

# Limpar cache do Vite e rebuild node_modules
RUN rm -rf node_modules/.vite && npm run build --if-present || true

# Expor porta
EXPOSE 5173

# Comando padrão
CMD ["npm", "run", "dev", "--", "--host"]