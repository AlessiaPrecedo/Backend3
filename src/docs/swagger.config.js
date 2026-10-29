import swaggerJsdoc from "swagger-jsdoc";
import { config } from "../config/env.config.js";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "ShipNow API",
    version: "1.0.0",
    description:
      "Documentación de ShipNow: usuarios, productos, mocks y validación del sistema de logging.",
  },
  servers: [
    {
      url: `http://localhost:${config.port}`,
      description: "Servidor local de desarrollo",
    },
  ],
  tags: [
    { name: "Users", description: "Gestión de usuarios" },
    { name: "Products", description: "Gestión de productos" },
    { name: "Orders", description: "Pedidos del dominio. Actualmente no exponen endpoints HTTP activos." },
    { name: "Deliveries", description: "Entregas del dominio. Actualmente no exponen endpoints HTTP activos." },
    { name: "Mocks", description: "Generación y carga de datos mock para pruebas" },
    { name: "Logger", description: "Validación del sistema de logging" },
  ],
};

export const swaggerSpec = swaggerJsdoc({
  definition: swaggerDefinition,
  apis: ["./src/docs/*.yaml"],
});

