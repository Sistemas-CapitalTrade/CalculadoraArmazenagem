# 1. Use uma imagem oficial do Node.js como base
FROM node:23-alpine3.19

# 2. Defina o diretório de trabalho
WORKDIR /app

# 3. Copie os arquivos do package.json e package-lock.json para instalar as dependências
COPY package*.json ./
# 4. Instale as dependências

RUN npm ci --silent
RUN npm install --frozen-lockfile

# 5. Copie o restante do código fonte da aplicação para o contêiner
COPY . .

RUN chmod +x ./node_modules/.bin/next || true
# 6. Se o Next.js estiver configurado para rodar em produção, construa a aplicação
RUN npm run build

EXPOSE 3001

# 9. Comando para rodar a aplicação Next.js
# CMD ["npm", "start"]
