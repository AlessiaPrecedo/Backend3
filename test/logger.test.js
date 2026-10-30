import assert from "node:assert/strict";
import test from "node:test";
import logger from "../src/utils/logger.js";

test("logger exposes all supported log levels and accepts structured metadata", () => {
  const supportedLevels = ["fatal", "error", "warning", "http", "info", "debug"];

  assert.ok(supportedLevels.every((level) => typeof logger[level] === "function"));
  assert.ok(supportedLevels.includes(logger.level));

  assert.doesNotThrow(() => {
    logger.debug("Test log: debug", { test: true, scope: "unit" });
    logger.http("Test log: http", { test: true, scope: "unit" });
    logger.info("Test log: info", { test: true, scope: "unit" });
    logger.warning("Test log: warning", { test: true, scope: "unit" });
    logger.error("Test log: error", { test: true, scope: "unit" });
    logger.fatal("Test log: fatal", { test: true, scope: "unit" });
  });
});
