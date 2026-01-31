# 🎾 proyecto-fullstack-totsport

## Descripción
**TotSport** es una aplicación FullStack (Backend + Frontend) desarrollada con el stack MERN (MongoDB, Express, React, Node.js) que permite la gestión integral de un complejo deportivo.

Los usuarios pueden registrarse, gestionar su perfil, consultar disponibilidad en tiempo real y reservar pistas de diferentes deportes.

Los administradores tienen un panel de control avanzado para gestionar pistas, usuarios y roles, asegurando la integridad de la plataforma.

---

## Características
- **Autenticación:** Registro y login seguro con JWT y encriptación Bcrypt.
- **Gestión de Roles:** Sistema de permisos (`user` y `admin`).
- **Seguridad Crítica:** Protección lógica que impide eliminar o degradar al Administrador Principal.
- **Gestión de Archivos:** Subida de avatares y fotos de pistas a Cloudinary.
- **Reservas Inteligentes:** Control de duplicados y bloqueo de horarios pasados.
- **Semilla Avanzada:** Carga masiva de datos desde archivos CSV con generación automática de reservas.
- **Interfaz React:** Frontend moderno y responsive utilizando Chakra UI.

---

## Tecnologías utilizadas
- node.js
- express
- react
- vite
- mongodb
- mongoose
- chakra-ui
- react-hook-form
- dotenv
- bcrypt
- jsonwebtoken
- cloudinary
- multer
- csv-parser

---

## Instalación y uso
Este proyecto se divide en dos carpetas: `server` (Backend) y `client` (Frontend). 

1. Configuración del Backend
    1. Entra en la carpeta del servidor:
    `cd server`

    2. Instala las dependencias:
    `npm install`

    3. Crea un archivo `.env` con las siguientes variables:
    DB_URL = <tu_mongodb_atlas_url>
    JWT_SECRET = <tu_clave_jwt>
    CLOUD_NAME = <nombre_cloudinary>
    API_KEY = <api_key_cloudinary>
    API_SECRET = <api_secret_cloudinary>

    4. (Opcional) Ejecuta la semilla para cargar usuarios y pistas desde CSV:
    `npm run seed`

    5. Levanta el servidor:
    `npm run dev`

2. Configuración del Frontend
    1. Entra en la carpeta del cliente (en otra terminal):
    `cd client`

    2. Instala las dependencias:
    `npm install`

    3. Crea un archivo `.env` con la conexión a la API:
    VITE_API_URL=http://localhost:3000/api/v1

    4. Levanta el cliente:
    `npm run dev`

---

## Modelos de la base de datos

### User
| Campo | Tipo | Descripción |
|-------|------|------------|
| name | String | Nombre completo del usuario |
| email | String | Correo electrónico único |
| password | String | Contraseña encriptada |
| role | String | `user` por defecto, puede ser `admin` |
| image | String | URL del avatar en Cloudinary |
| age | Number | Edad del usuario (opcional) |

### Court (Pista)
| Campo | Tipo | Descripción |
|-------|------|------------|
| name | String | Nombre de la pista (único) |
| sport | String | Tipo de deporte (Tenis, Pádel, etc.) |
| price | Number | Precio por hora |
| description | String | Detalles de la instalación |
| image | String | URL de la foto en Cloudinary |

### Reservation
| Campo | Tipo | Descripción |
|-------|------|------------|
| user | ObjectId | Referencia al modelo `User` |
| court | ObjectId | Referencia al modelo `Court` |
| date | Date | Fecha de la reserva (normalizada) |
| timeSlot | String | Franja horaria (ej: "10:00 - 11:00") |
| totalPrice | Number | Precio pagado en el momento |

---

## Endpoints de la API

### Users
| Método | Ruta | Descripción | Roles |
|--------|-----|------------|-------|
| POST | `/users/register` | Registro de nuevo usuario | Público |
| POST | `/users/login` | Inicio de sesión y token | Público |
| GET | `/users/` | Listar todos los usuarios | Admin |
| PATCH | `/users/:id` | Actualizar perfil (texto/foto) o Rol | User (Propio) / Admin |
| DELETE | `/users/:id` | Eliminar cuenta | User (Propio) / Admin |

### Courts
| Método | Ruta | Descripción | Roles |
|--------|-----|------------|-------|
| GET | `/courts/` | Listar todas las pistas | Público |
| GET | `/courts/:id` | Ver detalle de una pista | Público |
| POST | `/courts/` | Crear nueva pista con foto | Admin |
| PUT | `/courts/:id` | Editar datos de pista | Admin |
| DELETE | `/courts/:id` | Borrar pista y sus reservas | Admin |

### Reservations
| Método | Ruta | Descripción | Roles |
|--------|-----|------------|-------|
| POST | `/reservations/` | Crear una reserva | User / Admin |
| GET | `/reservations/` | Ver mis reservas | User / Admin |
| DELETE | `/reservations/:id` | Cancelar reserva | User (Propio) |

---

## Middlewares
- **isAuth:** Verifica el token JWT para rutas protegidas.
- **isAdmin:** Verifica que el usuario tenga rol de administrador.  
- **file:** Middleware para subida de imágenes a Cloudinary.

---

## Semilla (Seed)
- Utiliza `fs` y `csv-parser` para leer archivos `users.csv` y `courts.csv`.
- Genera usuarios con contraseñas encriptadas automáticamente.
- Crea reservas aleatorias relacionando usuarios y pistas, evitando colisiones de horario mediante lógica de `Set` para claves únicas.

---

## Control de roles y permisos
- **Admin Principal:** El usuario con email `admin@reservas.com` es inmutable; no se puede borrar ni cambiar su rol. 
- **Usuarios:** Solo pueden editar su propio perfil y cancelar sus propias reservas (si faltan más de 30 min).
- **Admin:** Puede gestionar todo el contenido (Pistas y Usuarios), salvo al Admin Principal.
- **Frontend:** La interfaz deshabilita visualmente los botones y selectores cuando una acción no está permitida por seguridad.

---

## URL del repositorio
[https://github.com/shaidalarcon/proyecto-reservas](https://github.com/shaidalarcon/proyecto-reservas)

---

## Autora
- Shaida Alarcón