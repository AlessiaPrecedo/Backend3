import { MocksService } from "../services/mocks.service.js";

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
