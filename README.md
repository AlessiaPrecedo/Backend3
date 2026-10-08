# ShipNow API

API de ShipNow desarrollada con Node.js, Express y MongoDB, organizada en capas de rutas, controladores, servicios, repositorios y modelos.

## Requisitos

- Node.js
- MongoDB

## Configuración

Instala las dependencias y crea un archivo `.env` a partir de `.env.example`:

```bash
npm install
npm test
npm run dev
```

La aplicación conecta con MongoDB antes de abrir el servidor. Configura `MONGODB_URI` con una base disponible.

La suite incluye pruebas de generación de mocks que no requieren una conexión a MongoDB.

## Manejo de errores

Los errores de rutas, validación, dominio y persistencia pasan por el middleware global. La respuesta mantiene el formato:

```json
{
  "status": "error",
  "error": "INVALID_MOCK_AMOUNT",
  "message": "quantity must be an integer between 1 and 50"
}
```

Los detalles técnicos solo se incluyen en el entorno `development`. Las rutas y controllers no construyen respuestas de error por separado.

## Mocking

El router de mocking está montado en `/api/mocks`. Los datos se generan usando Faker y constantes del proyecto. Las consultas `GET` solo devuelven datos y no escriben en MongoDB. `qty` admite enteros entre 1 y 50; si se omite, se usa el valor predeterminado 10.

### Generar datos sin guardarlos

```http
GET /api/mocks/users?qty=2
GET /api/mocks/drivers?qty=2
GET /api/mocks/orders?qty=2
GET /api/mocks/deliveries?qty=2
GET /api/mocks?qty=2
```

`users` genera exactamente `qty` clientes; `drivers` genera exactamente `qty` usuarios con rol de repartidor. `orders` genera exactamente `qty` pedidos. `deliveries` contiene las entregas de los pedidos no cancelados, así que su cantidad puede ser menor que `qty`. Los documentos se construyen con referencias Mongo válidas. La respuesta de `GET /api/mocks` incluye un conjunto enlazado con `users`, `drivers`, `orders` y `deliveries` para inspeccionar las relaciones juntas. Para esa carga agrupada, se crean al menos un repartidor y aproximadamente uno cada tres clientes.

Los pedidos usan estados y prioridades permitidos por las constantes. Los pedidos cancelados no tienen entrega; las entregas pendientes aún no tienen repartidor asignado, y las demás apuntan a un usuario con rol `DRIVER`.

### Insertar datos de prueba en MongoDB

```http
POST /api/mocks/load?qty=2
```

El endpoint genera e inserta usuarios, pedidos y entregas relacionados, y responde `201` con las cantidades insertadas y los documentos creados. Cada llamada carga un lote nuevo. `qty` debe ser un entero entre 1 y 50; una cantidad inválida devuelve `400`, una base no conectada devuelve `503` y los fallos de inserción devuelven un error uniforme de persistencia. Si falla una inserción, el servicio intenta retirar los documentos del mismo lote y conserva los errores de limpieza para diagnóstico en `development`.

La carga se implementa en `MocksService`; el servicio coordina los generadores y repositorios, mientras que los repositorios acceden a los modelos Mongoose.
