# DevLocker (Reto-Backend)

API REST para guardar fragmentos de código (**snippets**) de forma privada y segura. Cada usuario solo puede ver y gestionar sus propios snippets.

---

## Tecnologías

- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **JWT** (jsonwebtoken)
- **bcryptjs** — hash de contraseñas
- **express-validator** — validación de entradas

---

## Requisitos Previos

- Node.js >= 18
- Docker Desktop (para levantar MongoDB) — o una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)

---

## Instalación y Ejecución

### 1. Clonar e instalar dependencias
```bash
git clone <url-del-repo>
cd reto-backend
npm install
```

### 2. Configurar variables de entorno
```bash
cp .env.example .env
# Edita .env con tu MONGO_URI y JWT_SECRET
```

### 3. Levantar MongoDB con Docker
```bash
docker-compose up -d
```
Esto inicia MongoDB en el puerto `27017` y una interfaz gráfica en `http://localhost:8081` (usuario: `admin`, contraseña: `pass`).

> **Sin Docker:** usa una URI de [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) en la variable `MONGO_URI` del `.env`.

### 4. Iniciar el servidor
```bash
npm run dev        # modo desarrollo (nodemon)
npm start          # modo producción
```

El servidor corre en `http://localhost:3000` por defecto.

---

## Variables de Entorno (`.env`)

| Variable        | Descripción                            | Ejemplo                                      |
|-----------------|----------------------------------------|----------------------------------------------|
| `PORT`          | Puerto del servidor                    | `3000`                                       |
| `NODE_ENV`      | Entorno de ejecución                   | `development`                                |
| `MONGO_URI`     | URI de conexión a MongoDB              | `mongodb://localhost:27017/devlocker`         |
| `JWT_SECRET`    | Clave secreta para firmar los tokens   | `una_clave_muy_segura`                       |
| `JWT_EXPIRES_IN`| Duración del token                     | `7d`                                         |

---

## Endpoints

### Auth (`/api/v1/auth`)

| Método | Endpoint              | Descripción              | Acceso  |
|--------|-----------------------|--------------------------|---------|
| POST   | `/api/v1/auth/register` | Registrar usuario        | Público |
| POST   | `/api/v1/auth/login`    | Iniciar sesión (JWT)     | Público |

#### Registro — Body
```json
{
  "username": "devuser",
  "email": "dev@example.com",
  "password": "secret123"
}
```

#### Login — Body
```json
{
  "email": "dev@example.com",
  "password": "secret123"
}
```

---

### Snippets (`/api/v1/snippets`)

> Todos los endpoints requieren el header: `Authorization: Bearer <token>`

| Método | Endpoint                | Descripción                                   |
|--------|-------------------------|-----------------------------------------------|
| POST   | `/api/v1/snippets`      | Crear snippet (dueño = usuario del token)     |
| GET    | `/api/v1/snippets`      | Listar snippets propios                       |
| PUT    | `/api/v1/snippets/:id`  | Editar snippet (solo si es el dueño)          |
| DELETE | `/api/v1/snippets/:id`  | Borrar snippet (solo si es el dueño)          |

#### Crear / Editar Snippet — Body
```json
{
  "title": "Array flatten",
  "language": "javascript",
  "code": "const flat = arr => arr.flat(Infinity);",
  "tags": ["arrays", "utils"]
}
```

---

## Seguridad — El "Muro de Privacidad"

- El `userId` **nunca** se acepta en el body.
- El dueño se extrae directamente de `req.user._id` (del token JWT).
- Las operaciones `PUT` y `DELETE` usan un filtro combinado `{ _id, user }`, por lo que si el token pertenece a otro usuario simplemente no encontrará el documento → responde **404**.

### Prueba de Fuego

1. Registra **User A** y **User B**.
2. Con token de User A crea un snippet, anota su `_id`.
3. Con token de User B intenta `DELETE /api/v1/snippets/<id>`.
4. Respuesta esperada: `404 - Snippet no encontrado o no tienes permiso para eliminarlo`.

---
