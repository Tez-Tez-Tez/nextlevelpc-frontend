FROM node:18-alpine

# Instala serve (sin modificar package.json)
RUN npm install -g serve

WORKDIR /app

# Copia package files
COPY package*.json ./

# Instala dependencias (incluye las que YA tienes)
RUN npm ci

# Copia código
COPY . .

# Build con tu script EXISTENTE
RUN npm run build

# Expone puerto
EXPOSE 5173

# Sirve con serve (no necesita index.js)
CMD ["serve", "-s", "dist", "-l", "5173"]