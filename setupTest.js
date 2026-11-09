import dotenv from "dotenv";
import { fileURLToPath } from "node:url";

const envPath = fileURLToPath(new URL("./.env.test", import.meta.url));
const { error } = dotenv.config({ path: envPath, override: true });

if (error) {
  throw error;
}
