FROM node:18-alpine

# Instala un servidor web ligero
RUN npm install -g serve

WORKDIR /app

# Copia los archivos buildados
COPY dist ./dist

# Exponer puerto
EXPOSE 5173

# Servir archivos estáticos
CMD ["serve", "-s", "dist", "-l", "5173"]