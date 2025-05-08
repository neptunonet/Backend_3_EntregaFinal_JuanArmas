# Usar una imagen base de Node.js con la versión LTS
FROM node:18-alpine

# Establecer el directorio de trabajo en la aplicación
WORKDIR /app

# Copiar los archivos de configuración de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente de la aplicación
COPY . .

# Exponer el puerto en el que se ejecuta la aplicación
EXPOSE 4000

# Comando para iniciar la aplicación
CMD ["npm", "start"]