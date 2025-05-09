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


## Docker

### Enlace a la imagen en DockerHub
La imagen de este proyecto está disponible en DockerHub en el siguiente enlace:
[https://hub.docker.com/r/neptunonet/backend3-entrega-final_juan-armas/](https://hub.docker.com/r/neptunonet/backend3-entrega-final_juan-armas)

### Instrucciones para ejecutar el proyecto con Docker

#### Opción 1: Descargar y ejecutar la imagen desde DockerHub
Para ejecutar el proyecto utilizando la imagen publicada en DockerHub, ejecuta el siguiente comando:

```bash
docker pull neptunonet/backend3-entrega-final_juan-armas:1.0.1
docker run -e "PORT=4000" -e "MONGODB_URL=mongodb+srv://juancho:je05zblita9mijJh@cluster0.fd1th.mongodb.net/FinalBackendIII" -p 4000:4000 neptunonet/backend3-entrega-final_juan-armas:1.0.1
