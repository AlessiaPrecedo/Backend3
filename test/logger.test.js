import { expect } from "chai";
import { describe, it } from "mocha";
import logger from "../src/utils/logger.js";

describe("logger", () => {
  it("exposes supported levels and accepts structured metadata", () => {
    const supportedLevels = ["fatal", "error", "warning", "http", "info", "debug"];

    expect(supportedLevels.every((level) => typeof logger[level] === "function")).to.equal(true);
    expect(supportedLevels).to.include(logger.level);

    expect(() => {
      logger.debug("Test log: debug", { test: true, scope: "unit" });
      logger.http("Test log: http", { test: true, scope: "unit" });
      logger.info("Test log: info", { test: true, scope: "unit" });
      logger.warning("Test log: warning", { test: true, scope: "unit" });
      logger.error("Test log: error", { test: true, scope: "unit" });
      logger.fatal("Test log: fatal", { test: true, scope: "unit" });
    }).to.not.throw();
  });
});
