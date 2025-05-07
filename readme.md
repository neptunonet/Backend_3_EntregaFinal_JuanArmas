# Entrega Final - Juan Ignacio Armas

## Programación Backend III: Testing y Escalabilidad Backend 
## Comisión 70375

## Objetivos generales
Implementar las últimas mejoras en nuestro proyecto y Dockerizarlo.


## Objetivos específicos
Documentar las rutas restantes de nuestro proyecto.
- Añadir los últimos tests
- Crear una imagen de Docker.

## Se debe entregar
- Documentar con Swagger el módulo de “Users”.
- Desarrollar los tests funcionales para todos los endpoints del router “adoption.router.js”.
- Desarrollar el Dockerfile para generar una imagen del proyecto.
- Subir la imagen de Docker a Dockerhub y añadir en un ReadMe.md al proyecto que contenga el link de dicha imagen.

## Criterios:
Desarrollo de Tests Funcionales:
- Se han desarrollado tests funcionales para todos los endpoints del router adoption.router.js.
- Todos los endpoints del router adoption.router.js están cubiertos por tests funcionales.
- Los tests verifican de manera efectiva el funcionamiento de cada endpoint, incluyendo casos de éxito y casos de error.

Creación del Dockerfile:
- Se ha creado un Dockerfile que permite generar una imagen del proyecto de manera adecuada.
- El Dockerfile está correctamente configurado para construir la imagen del proyecto de forma reproducible.
- Se incluyen todos los pasos necesarios en el Dockerfile para instalar las dependencias, copiar los archivos del proyecto y configurar el entorno de ejecución.

Subida de la Imagen a Dockerhub:
- Se ha subido la imagen generada del proyecto a Dockerhub.
- La imagen del proyecto se encuentra disponible en Dockerhub y es accesible a través de un enlace público.
- Se ha añadido un ReadMe.md al proyecto que contiene el enlace a la imagen de Dockerhub.

Documentación en ReadMe.md:
- El ReadMe.md del proyecto contiene información detallada, incluyendo el enlace a la imagen de Dockerhub.
- El ReadMe.md proporciona instrucciones claras para ejecutar el proyecto con Docker y acceder a la imagen en Dockerhub.
- Se incluyen detalles sobre cómo construir la imagen, ejecutar el contenedor y utilizar el proyecto de manera efectiva.



##  Formato
 - Link al repositorio de Github con el proyecto completo, sin la carpeta de Node_modules.

##  Postman
  - Se encuentra disponible el en Github el archivo *Backend3_PreEntega1.postman_collection.json* para importar en Postman para tener una visión más clara de las rutas y los endpoints.

## Dependencias:

Este proyecto utiliza las siguientes dependencias:

```json
  "dependencies": {
    "@faker-js/faker": "^9.6.0",
    "bcrypt": "^5.1.0",
    "cookie-parser": "^1.4.6",
    "dotenv": "^16.4.7",
    "express": "^4.18.2",
    "jsonwebtoken": "^8.5.1",
    "mongoose": "^6.7.5",
    "multer": "^1.4.5-lts.1",
    "supertest": "^6.3.3"
  },
  "devDependencies": {
    "chai": "^4.3.7",
    "mocha": "^10.1.0",
    "nodemon": "^3.1.9"
  }
```
git clone https://github.com/neptunonet/Backend_3_PreEntrega_JuanArmas.git

