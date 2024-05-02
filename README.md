### README (FR)

#### API WildLens - Backend pour l'Application de Classification d'Empreintes Animales

**Description :**  
L'API WildLens sert de backend pour l'application de classification d'empreintes animales. Elle gère les interactions entre le front-end et la base de données, traitant la réception des images, leur classification, et la récupération des informations sur les animaux.

**Fonctionnalités :**  
- Réception et stockage des fichiers image téléchargés.
- API RESTful pour la classification des empreintes.
- Stockage et récupération des données de classification ainsi que des informations utilisateur.

**Installation :**  
1. Cloner ce dépôt.
2. Si Docker n'est pas déjà installé, procéder à son installation.
3. Construire le conteneur avec la commande : `docker build -t mspr3 .`
4. Lancer le conteneur avec la commande : `docker run -d -p 5000:5000 --name my-container mspr3`
5. Alternativement, pour démarrer le backend directement sans Docker, exécutez : `node app.js`
6. L'API est ensuite accessible via `http://localhost:5000/api`.

**Technologies utilisées :**  
- Node.js et Express pour le développement de l'API.
- Docker pour la conteneurisation, facilitant le déploiement et la portabilité.


### README (ENG)

#### WildLens API - Backend for the Animal Track Classification Application

**Description:**  
The WildLens API serves as the backend for the animal track classification application. It manages interactions between the front-end and the database, handling the reception of images, their classification, and the retrieval of information about the animals.

**Features:**  
- Reception and storage of uploaded image files.
- RESTful API for track classification.
- Storage and retrieval of classification data as well as user information.

**Installation:**  
1. Clone this repository.
2. If not already installed, install Docker.
3. Build the container with the command: `docker build -t mspr3 .`
4. Launch the container with the command: `docker run -d -p 5000:5000 --name my-container mspr3`
5. Alternatively, to start the backend directly without Docker, run: `node app.js`
6. The API is then accessible via `http://localhost:5000/api`.

**Technologies used:**  
- Node.js and Express for API development.
- Docker for containerization, facilitating deployment and portability.


