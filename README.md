# 🐾 HuellaP

Plataforma web para reencontrar mascotas perdidas. Las personas publican mascotas **perdidas** o **encontradas** (especie, descripción, foto, zona, fecha y ubicación) y una **inteligencia artificial** compara las publicaciones y avisa automáticamente cuando encuentra una coincidencia probable.

> Proyecto desarrollado para una hackathon.

## 💡 ¿Qué problema resuelve?

Hoy las mascotas perdidas se buscan en grupos de Facebook y WhatsApp: las publicaciones se pierden en el scroll, no tienen un formato común y nadie cruza la información de quien perdió una mascota con la de quien la encontró. **HuellaP busca por vos**: ordena los datos, los cruza y te avisa.

## ⚙️ ¿Cómo funciona?

1. La persona se registra y crea una publicación (*Perdí* o *Encontré*).
2. El sistema filtra las publicaciones del tipo opuesto, de la misma especie, cercanas en zona y fecha.
3. La IA compara los candidatos y devuelve un puntaje de similitud con una explicación.
4. Si el puntaje supera el umbral, se notifica a ambas personas (email y bandeja interna).
5. Las personas confirman el reencuentro y la publicación se marca como resuelta.

> La IA **sugiere**, nunca decide: la confirmación final es siempre humana.

## ✨ Funcionalidades

- Registro e inicio de sesión
- Publicación de mascotas perdidas y encontradas, con foto y ubicación en el mapa
- Listado con filtros por tipo, especie y zona
- Matching automático con IA
- Notificaciones por email y dentro de la app
- Confirmación o descarte de coincidencias
- Publicaciones marcadas como resueltas

## 🛠️ Tecnologías

| Capa | Tecnología |
|---|---|
| Backend | Node.js + Express |
| Frontend | HTML, CSS, JavaScript, plantillas EJS y Bootstrap |
| Base de datos | MongoDB Atlas + Mongoose |
| Mapas | Leaflet + OpenStreetMap |
| Fotos | Cloudinary |
| IA | API de un modelo de lenguaje con visión (Claude) |
| Emails | Nodemailer |

## 📋 Requisitos previos

- [Node.js](https://nodejs.org/) (versión LTS)
- Cuenta gratuita en [MongoDB Atlas](https://www.mongodb.com/atlas)
- Cuenta gratuita en [Cloudinary](https://cloudinary.com/)
- API key del proveedor de IA

## 🚀 Instalación

```bash
# 1. Clonar el repositorio
git clone <URL-DEL-REPOSITORIO>
cd huellap

# 2. Instalar dependencias
npm install

# 3. Crear el archivo de variables de entorno
cp .env.example .env
# Completar los valores en .env

# 4. Iniciar el servidor en modo desarrollo
npm run dev
```

La aplicación queda disponible en `http://localhost:3000`.

## 🔐 Variables de entorno

Crear un archivo `.env` en la raíz del proyecto (**nunca subirlo a GitHub**):

```
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
```

## 📁 Estructura del proyecto

```
huellap/
├── src/
│   ├── models/        # Esquemas de Mongoose (Usuario, Publicacion, Coincidencia, Notificacion)
│   ├── routes/        # Rutas de Express
│   ├── controllers/   # Lógica de cada ruta
│   ├── services/      # Matching con IA, notificaciones y emails
│   ├── views/         # Plantillas EJS
│   └── public/        # CSS, JS del cliente e imágenes
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🤝 Flujo de trabajo en equipo

- La rama `main` siempre debe funcionar: no se trabaja directo sobre ella.
- Cada persona trabaja en su propia rama (`feature/nombre-de-la-tarea`).
- Se integra a `main` mediante **Pull Request**, revisado por al menos otra persona.
- Commits chicos y con mensajes claros (por ejemplo: `Agrega formulario de publicación`).

## 🔒 Limitaciones

- La IA puede equivocarse, por eso la confirmación final es humana.
- La calidad de las coincidencias depende de la calidad de las fotos y descripciones.
- El prototipo está pensado para una zona geográfica acotada.
- Se maneja información personal: la ubicación pública es aproximada y el contacto pasa por la plataforma.

## 🗺️ Próximos pasos

- Notificaciones push en el celular
- Aplicación móvil
- Convenios con veterinarias, refugios y municipios
- Moderación y verificación de usuarios

## 👩‍💻 Equipo

| Integrante | Área principal |
|---|---|
| Carolina | Matching con IA y notificaciones |
| Delfina | Backend base, base de datos y autenticación |
| Candela | Frontend y presentación |

## 📄 Licencia

Proyecto académico desarrollado para una hackathon.
