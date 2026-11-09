import { expect } from "chai";
import mongoose from "mongoose";
import { after, before, beforeEach, describe, it } from "mocha";
import { config } from "../src/config/env.config.js";
import { connectDB } from "../src/config/db.config.js";
import Delivery from "../src/models/delivery.model.js";
import Order from "../src/models/order.model.js";
import User from "../src/models/user.model.js";
import { apiRequest } from "../supportTest.js";

const errorResponse = (response, status, code, message) => {
  expect(response.status).to.equal(status);
  expect(response.body).to.include({
    status: "error",
    error: code,
    message,
  });
};

const createUser = async (email = "cliente@example.test") => {
  const response = await apiRequest("post", "/users").send({
    firstName: "Ana",
    lastName: "Prueba",
    email,
    password: "test-password",
  });
  expect(response.status).to.equal(201);
  return response.body;
};

const createOrder = async (customer) => {
  const response = await apiRequest("post", "/orders").send({
    customer,
    items: [{ name: "Paquete de prueba", quantity: 1, price: 250 }],
    deliveryAddress: "Calle de prueba 123",
    total: 250,
  });
  expect(response.status).to.equal(201);
  return response.body;
};

describe("API funcional", function () {
  this.timeout(15000);

  before(async () => {
    expect(config.nodeEnv).to.equal("test");
    expect(config.mongoDbName).to.match(/(?:^|[_-])test$/i);
    await connectDB();
  });

  beforeEach(async () => {
    await Promise.all([
      User.deleteMany({}),
      Order.deleteMany({}),
      Delivery.deleteMany({}),
    ]);
  });

  after(async () => {
    try {
      await Promise.all([
        User.deleteMany({}),
        Order.deleteMany({}),
        Delivery.deleteMany({}),
      ]);
    } finally {
      await mongoose.disconnect();
    }
  });

  describe("usuarios", () => {
    it("lista usuarios con su estructura de recurso", async () => {
      await createUser();
      const response = await apiRequest("get", "/users");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array").with.lengthOf(1);
      expect(response.body[0]).to.include({
        firstName: "Ana",
        lastName: "Prueba",
        email: "cliente@example.test",
        role: "customer",
      });
      expect(response.body[0]).to.have.property("_id").that.is.a("string");
    });

    it("crea un usuario válido y permite consultarlo por ID", async () => {
      const user = await createUser();
      const response = await apiRequest("get", `/users/${user._id}`);

      expect(response.status).to.equal(200);
      expect(response.body).to.include({
        _id: user._id,
        email: "cliente@example.test",
        role: "customer",
      });
      expect(response.body).to.have.property("createdAt").that.is.a("string");
    });

    it("responde con error de validación ante datos incompletos", async () => {
      const response = await apiRequest("post", "/users").send({
        firstName: "Ana",
        email: "incompleto@example.test",
      });

      errorResponse(response, 400, "VALIDATION_ERROR", "the data sent is not valid");
    });

    it("responde 404 con el formato de error ante un usuario inexistente", async () => {
      const response = await apiRequest(
        "get",
        "/users/507f1f77bcf86cd799439011",
      );

      errorResponse(response, 404, "USER_NOT_FOUND", "user not found");
    });
  });

  describe("pedidos", () => {
    it("crea un pedido válido y lo lista y consulta por ID", async () => {
      const user = await createUser();
      const order = await createOrder(user._id);
      const listResponse = await apiRequest("get", "/orders");
      const getResponse = await apiRequest("get", `/orders/${order._id}`);

      expect(order).to.include({
        customer: user._id,
        deliveryAddress: "Calle de prueba 123",
        status: "created",
        total: 250,
      });
      expect(order.items).to.deep.include({
        name: "Paquete de prueba",
        quantity: 1,
        price: 250,
      });
      expect(listResponse.status).to.equal(200);
      expect(listResponse.body).to.be.an("array").with.lengthOf(1);
      expect(listResponse.body[0]._id).to.equal(order._id);
      expect(getResponse.status).to.equal(200);
      expect(getResponse.body).to.include({
        _id: order._id,
        customer: user._id,
        status: "created",
      });
    });

    it("rechaza pedidos incompletos con el error de validación estándar", async () => {
      const user = await createUser();
      const response = await apiRequest("post", "/orders").send({
        customer: user._id,
        items: [],
      });

      errorResponse(response, 400, "VALIDATION_ERROR", "the data sent is not valid");
    });

    it("rechaza un estado de pedido inválido con el error de validación estándar", async () => {
      const user = await createUser();
      const response = await apiRequest("post", "/orders").send({
        customer: user._id,
        items: [{ name: "Paquete", quantity: 1, price: 250 }],
        deliveryAddress: "Calle de prueba 123",
        status: "en_camino",
      });

      errorResponse(response, 400, "VALIDATION_ERROR", "the data sent is not valid");
    });

    it("responde 404 con el formato documentado si no existe el pedido", async () => {
      const response = await apiRequest(
        "get",
        "/orders/507f1f77bcf86cd799439011",
      );

      errorResponse(response, 404, "ORDER_NOT_FOUND", "order not found");
    });
  });

  describe("mocks", () => {
    it("genera usuarios mock con la cantidad y propiedades solicitadas", async () => {
      const response = await apiRequest("get", "/api/mocks/users?qty=2");

      expect(response.status).to.equal(200);
      expect(response.body).to.be.an("array").with.lengthOf(2);
      expect(response.body[0]).to.include.all.keys(
        "_id",
        "firstName",
        "lastName",
        "email",
        "role",
      );
      expect(response.body[0].role).to.equal("customer");
    });

    it("genera un bundle con colecciones enlazadas", async () => {
      const response = await apiRequest("get", "/api/mocks?qty=3");

      expect(response.status).to.equal(200);
      expect(response.body).to.have.all.keys(
        "users",
        "drivers",
        "orders",
        "deliveries",
      );
      expect(response.body.users).to.have.lengthOf(3);
      expect(response.body.orders).to.have.lengthOf(3);
      expect(response.body.drivers).to.be.an("array").that.is.not.empty;
    });

    it("responde con error definido para cantidades inválidas", async () => {
      const response = await apiRequest("get", "/api/mocks/users?qty=0");

      errorResponse(
        response,
        400,
        "INVALID_MOCK_AMOUNT",
        "quantity must be an integer between 1 and 50",
      );
    });

    it("responde con 404 y formato de error para un tipo de mock desconocido", async () => {
      const response = await apiRequest("get", "/api/mocks/unknown");

      errorResponse(
        response,
        404,
        "INVALID_MOCK_TYPE",
        "unsupported mock type: unknown",
      );
    });
  });

  describe("logger, Swagger y rutas inexistentes", () => {
    it("ejecuta el endpoint de prueba del logger", async () => {
      const response = await apiRequest("get", "/api/mocks/logs-test");

      expect(response.status).to.equal(200);
      expect(response.body).to.deep.equal({
        message: "One entry was sent for each log level.",
      });
    });

    it("sirve la interfaz de Swagger", async () => {
      const response = await apiRequest("get", "/api/docs/");

      expect(response.status).to.equal(200);
      expect(response.headers["content-type"]).to.include("text/html");
      expect(response.text).to.include("Swagger UI");
    });

    it("responde con error 404 estándar para una ruta inexistente", async () => {
      const response = await apiRequest("get", "/ruta-inexistente");

      errorResponse(response, 404, "ROUTE_NOT_FOUND", "route not found");
    });
  });
});
