# ⚙️ TOTSPORT - Backend API
Esta es la API RESTful de la plataforma TOTSPORT, construida con **Node.js** y **Express**, conectada a una base de datos NoSQL en **MongoDB Atlas**.

## Descripción 
Este servidor proporciona todos los servicios, endpoints y lógica de negocio necesarios para gestionar la aplicación TOTSPORT. Se encarga de la autenticación segura de usuarios, el procesamiento y validación de reservas en tiempo real, el almacenamiento de imágenes en Cloudinary y la carga automatizada de datos iniciales mediante un sistema de semillas.

## Características
- **Autenticación:** Registro y login de usuarios con encriptación de contraseñas mediante Bcrypt.
- **Seguridad:** Generación y validación de firmas seguras utilizando JSON Web Tokens (JWT).
- **Control de Roles:** Middleware de autorización para diferenciar permisos entre usuarios (`user`) y administradores (`admin`).
- **Integridad de Datos:** Protección estricta sobre el Administrador Principal (`admin@reservas.com`), impidiendo que sea eliminado o degradado de rol por cualquier otro usuario.
- **Gestión de Archivos:** Almacenamiento directo y borrado automatizado de imágenes en la nube con Cloudinary y Multer.
- **Semilla Avanzada:** Script automatizado que lee archivos `.csv` externos mediante `csv-parser` para poblar la base de datos con usuarios, pistas y reservas iniciales sin solapamientos de horarios.

## Tecnologías utilizadas
- node.js
- express
- mongodb
- mongoose
- dotenv
- bcrypt
- jsonwebtoken
- cloudinary
- multer
- csv-parser

## Instalación y uso local
1. Asegúrate de estar en la carpeta del servidor dentro de tu proyecto: 

   `cd server`

2. Instala todas las dependencias necesarias:
   
   `npm install`

3. Crea un archivo `.env` en la raíz de esta carpeta `/server` con las siguientes variables de entorno:
   
   `PORT = 3000`

   `DB_URL = <tu_mongodb_atlas_url>`

   `JWT_SECRET = <tu_clave_jwt_secreta>`

   `CLOUD_NAME = <tu_cloud_name_de_cloudinary>`

   `API_KEY = <tu_api_key_de_cloudinary>`

   `API_SECRET = <tu_api_secret_de_cloudinary>`

4. Levanta el servidor en entorno de desarrollo:

   `npm run dev`

5. (Opcional) Si quieres limpiar y rellenar la base de datos con los datos de prueba iniciales de los archivos CSV, ejecuta la semilla en una terminal aparte:

   `npm run seed`

## Modelos de la base de datos

### User
| Campo | Tipo | Descripción |
|-------|------|------------|
| name | String | Nombre completo del usuario |
| email | String | Correo electrónico (único y obligatorio) |
| password | String | Contraseña encriptada con hash de Bcrypt |
| role | String | Rol de usuario: `user` por defecto o `admin` |
| image | String | URL de la imagen de perfil alojada en Cloudinary |
| age | Number | Edad del usuario (opcional) |

### Court (Pista)
| Campo | Tipo | Descripción |
|-------|------|------------|
| name | String | Nombre identificativo de la pista (único) |
| sport | String | Tipo de deporte asociado (ej: Tenis, Pádel) |
| price | Number | Precio estipulado por hora de uso |
| description | String | Detalles de la instalación |
| image | String | URL de la fotografía de la pista en Cloudinary |

### Reservation
| Campo | Tipo | Descripción |
|-------|------|------------|
| user | ObjectId | Referencia de Mongoose al modelo `User` |
| court | ObjectId | Referencia de Mongoose al modelo `Court` |
| date | Date | Fecha de la reserva (normalizada) |
| timeSlot | String | Franja horaria reservada (ej: "10:00 - 11:00") |
| totalPrice | Number | Precio pagado en el momento |

## Endpoints de la API

### Users
| Método | Ruta | Descripción | Roles |
|--------|-----|------------|-------|
| POST | `/users/register` | Registra un nuevo usuario en la plataforma | Público |
| POST | `/users/login` | Inicia sesión y devuelve el token JWT | Público |
| GET | `/users/` | Lista todos los usuarios registrados | Admin |
| PATCH | `/users/:id` | Actualiza los datos de perfil o cambia roles | User (Propio) / Admin |
| DELETE | `/users/:id` | Elimina permanentemente la cuenta de un usuario | User (Propio) / Admin |

### Courts
| Método | Ruta | Descripción | Roles |
|--------|-----|------------|-------|
| GET | `/courts/` | Obtiene el listado de todas las pistas | Público |
| GET | `/courts/:id` | Obtiene los detalles de una pista específica | Público |
| POST | `/courts/` | Crea una nueva instalación con subida de imagen | Admin |
| PUT | `/courts/:id` | Modifica las especificaciones de una pista | Admin |
| DELETE | `/courts/:id` | Elimina una pista y todas sus reservas asociadas | Admin |

### Reservations
| Método | Ruta | Descripción | Roles |
|--------|-----|------------|-------|
| POST | `/reservations/` | Registra una nueva reserva validando que esté libre | User / Admin |
| GET | `/reservations/` | Obtiene el historial de reservas del usuario | User / Admin |
| DELETE | `/reservations/:id` | Cancela una reserva activa de forma permanente | User (Propio) |

## Middlewares
- **isAuth:** Intercepta la petición y verifica la firma del token JWT incluido en las cabeceras para autenticar al usuario.
- **isAdmin:** Comprueba que el usuario previamente autenticado posea el rol de administrador en su esquema de la base de datos.
- **file (Multer):** Gestiona la recepción de archivos en formato `form-data`, genera una ruta temporal y delega la subida a Cloudinary, guardando únicamente la URL final.

## Semilla (Seed)
El proyecto cuenta con un archivo ejecutable que utiliza los módulos `fs` y `csv-parser` para automatizar la inserción de datos iniciales a partir de ficheros estáticos `users.csv` y `courts.csv`.
- Encripta todas las contraseñas de los usuarios generados por defecto.
- Asocia reservas aleatorias uniendo usuarios y pistas existentes.
- Incluye algoritmos lógicos basados en estructuras `Set` para prevenir conflictos de horarios o pistas solapadas en la creación de las reservas de la semilla.

## Control de roles y permisos
- Los usuarios con rol estándar (`user`) solo tienen autoridad para eliminar su propia cuenta, cancelar sus propias reservas e intercambiar sus datos personales (nombre, imagen). Bajo ningún concepto pueden modificar su campo `role`. 
- Los administradores (`admin`) pueden examinar la lista global, eliminar usuarios estándar y reasignar privilegios.
- **Regla del Administrador Principal:** Como blindaje de seguridad, la lógica del servidor intercepta cualquier acción sobre el correo electrónico `admin@reservas.com`. Si se detecta un intento de mutar su rol o eliminarlo, el sistema abortará la operación respondiendo inmediatamente con un estado `403 Forbidden`.