import { MocksService } from "../services/mocks.service.js";
import logger from "../utils/logger.js";

export const getMockBundle = (req, res) => {
  res.json(MocksService.generateBundle(req.query.qty));
};

export const getMocks = (req, res) => {
  res.json(MocksService.generate(req.params.type, req.query.qty));
};

export const loadMockData = async (req, res) => {
  const result = await MocksService.persistBundle(req.query.qty);
  res.status(201).json(result);
};

export const testLogs = (req, res) => {
  const context = { test: true, path: req.path };
  logger.debug("Test log: debug", context);
  logger.http("Test log: http", context);
  logger.info("Test log: info", context);
  logger.warning("Test log: warning", context);
  logger.error("Test log: error", context);
  logger.fatal("Test log: fatal", context);

  res.json({ message: "One entry was sent for each log level." });
};
