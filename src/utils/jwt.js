import jwt from "jsonwebtoken";
import { config } from "../config/env.config.js";

export function gtoken(payload) {
  return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "1h" });
}
export function vtoken(token) {
  return jwt.verify(token, config.JWT_SECRET);
}
