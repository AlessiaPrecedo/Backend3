# ShipNow API

API backend para la gestión de usuarios y productos de **ShipNow**, desarrollada con Node.js, Express y MongoDB.

El proyecto fue refactorizado utilizando una arquitectura de **3 capas: Controller, Service y Repository**, con el objetivo de separar responsabilidades y mejorar la mantenibilidad del código.

## Tecnologías

- Node.js
- Express
- MongoDB
- Mongoose
- Dotenv
- Nodemon

## Arquitectura

El proyecto utiliza una arquitectura por capas:

```text
Request
   ↓
Controller
   ↓
Service
   ↓
Repository
   ↓
MongoDB
```

### Controller

Es la puerta de entrada HTTP. Se encarga de recibir `req` y `res`, llamar al Service correspondiente y devolver la respuesta HTTP.

### Service

Contiene la lógica de negocio de la aplicación.

Por ejemplo:

- Evitar crear usuarios con un email ya registrado.
- Asignar un rol `CUSTOMER` cuando no se especifica uno.
- Evitar crear productos con un nombre duplicado.

### Repository

Es la única capa que conoce Mongoose y MongoDB. Se encarga de realizar las operaciones de consulta, creación, actualización y eliminación de datos.

Esta separación permite que el Service no dependa directamente de la base de datos y que el Controller no tenga lógica de persistencia.

## Estructura del proyecto

```text
src/
├── config/
│   └── env.config.js
├── constants/
│   └── index.js
├── controllers/
├── models/
├── repositories/
├── routes/
├── services/
└── app.js
```

## Configuración del entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
PORT=8080
MONGODB_URI=tu_mongodb_uri
NODE_ENV=development
```

También se incluye un archivo `.env.example` con las variables necesarias.

La configuración de entorno está centralizada en:

```text
src/config/env.config.js
```

El proyecto valida que estén definidas las variables `PORT`, `MONGODB_URI` y `NODE_ENV` antes de iniciar la aplicación.

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
git clone https://github.com/AlessiaPrecedo/Backend3.git
cd Backend3
npm install
```

Crear el archivo `.env` con las variables necesarias.

## Ejecutar el proyecto

Modo desarrollo:

```bash
npm run dev
```

El servidor se inicia en el puerto configurado en `PORT`.

## Constantes

Las constantes utilizadas por la aplicación se encuentran centralizadas en:

```text
src/constants/index.js
```

Se utilizan objetos `Object.freeze()` para evitar modificaciones accidentales de valores como roles de usuario y estados de productos.

## Objetivo de la refactorización

La refactorización busca separar responsabilidades:

- El **Controller** administra HTTP.
- El **Service** contiene las reglas de negocio.
- El **Repository** administra el acceso a MongoDB.

De esta manera, cada capa tiene una responsabilidad específica y el código resulta más modular, legible y fácil de mantener.
