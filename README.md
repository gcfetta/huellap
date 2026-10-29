🐾 HuellApp

Plataforma web para reencontrar mascotas perdidas. Las personas publican mascotas perdidas o encontradas (especie, descripción, foto, zona, fecha y ubicación) y una inteligencia artificial compara las publicaciones y avisa automáticamente cuando encuentra una coincidencia probable.


¿Cómo funciona?
La persona se registra y crea una publicación (Perdí o Encontré).
El sistema filtra publicaciones del tipo opuesto, de la misma especie, cercanas en zona y fecha.
La IA compara los candidatos y devuelve un puntaje de similitud con una explicación.
Si el puntaje supera el umbral, se notifica a ambas personas (email y bandeja interna).
Las personas confirman el reencuentro y la publicación se marca como resuelta.

La IA sugiere, nunca decide: la confirmación final es siempre humana.

Tecnologías
Capa	Tecnología
Backend	Node.js + Express
Frontend	HTML, CSS, JavaScript, plantillas EJS y Bootstrap
Base de datos	MongoDB Atlas + Mongoose
Mapas	Leaflet + OpenStreetMap
Fotos	Cloudinary
IA	API de un modelo de lenguaje con visión (Claude)
Emails	Nodemailer
Requisitos previos
Node.js (versión LTS)
Una cuenta gratuita en MongoDB Atlas
Una cuenta gratuita en Cloudinary
Una API key del proveedor de IA
Instalación
bash
# 1. Clonar el repositorio
git clone <URL-DEL-REPOSITORIO>
cd huellitas-match

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
cp .env.example .env
# Completar los valores en .env

# 4. Iniciar el servidor
npm run dev

La aplicación queda disponible en http://localhost:3000.

Variables de entorno

Crear un archivo .env en la raíz (nunca subirlo a GitHub) con:

PORT=3000
MONGODB_URI=
SESSION_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
AI_API_KEY=
EMAIL_USER=
EMAIL_PASS=
MATCH_THRESHOLD=70
MATCH_RADIUS_KM=10
Estructura del proyecto
huellitas-match/
├── src/
│   ├── models/        # Esquemas de Mongoose (Usuario, Publicacion, Coincidencia, Notificacion)
│   ├── routes/        # Rutas de Express
│   ├── controllers/   # Lógica de cada ruta
│   ├── services/      # Matching con IA, notificaciones, emails
│   ├── views/         # Plantillas EJS
│   └── public/        # CSS, JS del cliente e imágenes
├── .env.example
├── .gitignore
├── package.json
└── README.md


Flujo de trabajo en equipo
La rama main siempre debe funcionar: no se trabaja directo sobre ella.
Cada persona trabaja en su propia rama (feature/nombre-de-la-tarea).
Se integra a main mediante Pull Request revisado por al menos otra persona.
Commits chicos y con mensajes claros (por ejemplo: Agrega formulario de publicación).


Equipo
Carolina
Delfina
Candela
Licencia

Proyecto académico para hackathon.
