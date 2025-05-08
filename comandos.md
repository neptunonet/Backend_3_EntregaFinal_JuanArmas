## Docker

    - Crear Imagen
        ❯ docker build -t backend3-entrega-final_juan-armas .

    - Crear una instancia de imagen
        ❯ docker run -p 4000:4000 backend3-entrega-final_juan-armas

        Usando ENV desde consola
        ❯ docker run -e "PORT=4000" -e "MONGODB_URL=mongodb+srv://juancho:je05zblita9mijJh@cluster0.fd1th.mongodb.net/FinalBackendIII" -p 4000:4000 backend3-entrega-final_juan-armas


    #Subir IMG a DockerHub
        - Login
            ❯ docker login
            ❯ docker login -u neptunonet
        - cramos Tag
            ❯ docker tag backend3-entrega-final_juan-armas neptunonet/backend3-entrega-final_juan-armas:1.0.0
            ❯ docker push neptunonet/backend3-entrega-final_juan-armas:1.0.0

