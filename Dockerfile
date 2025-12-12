# Etapa de build
FROM node:18-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala dependencias
RUN npm ci --only=production

# Copia el resto del código
COPY . .

# Build de la aplicación
RUN npm run build

# Etapa de producción
FROM nginx:alpine

# Copia los archivos build al nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia la configuración de nginx
COPY nginx.conf /etc/nginx/nginx.conf

# Expone el puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]