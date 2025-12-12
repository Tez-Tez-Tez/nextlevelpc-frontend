FROM node:18-alpine

# Instala serve (servidor web estático ligero)
RUN npm install -g serve

# Establece directorio de trabajo
WORKDIR /app

# Copia package files para build
COPY package*.json ./

# Instala todas las dependencias (incluyendo dev para build)
RUN npm ci

# Copia todo el código
COPY . .

# Build de producción
RUN npm run build

# Expone el puerto
EXPOSE 5173

# Sirve los archivos estáticos del build
CMD ["serve", "-s", "dist", "-l", "5173"]