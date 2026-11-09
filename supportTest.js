import request from "supertest";
import app from "./src/app.js";

const requestMethods = new Set([
  "delete",
  "get",
  "head",
  "patch",
  "post",
  "put",
]);

export function apiRequest(method, path) {
  const normalizedMethod = method.toLowerCase();

  if (!requestMethods.has(normalizedMethod)) {
    throw new TypeError(`Unsupported test request method: ${method}`);
  }

  const client = request(app);
  return client[normalizedMethod](path);
}
