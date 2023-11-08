# Use a imagem oficial do Node.js
FROM node:14

# Crie um diretório de trabalho no contêiner
WORKDIR /app

# Copie os arquivos de sua API para o diretório de trabalho
COPY . /app

# Instale as dependências
RUN npm install

# Exponha a porta em que sua API será executada
EXPOSE 8080

# Inicie a sua API
CMD ["npm","run","start"]
