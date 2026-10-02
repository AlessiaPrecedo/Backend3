import { MocksService } from "../services/mocks.service.js";

export const getMockBundle = (req, res) => {
  try {
    res.json(MocksService.generateBundle(req.query.qty));
  } catch (error) {
    res.status(error.status ?? 500).json({ message: error.message });
  }
};

export const getMocks = (req, res) => {
  try {
    res.json(MocksService.generate(req.params.type, req.query.qty));
  } catch (error) {
    res.status(error.status ?? 500).json({ message: error.message });
  }
};

export const loadMockData = async (req, res) => {
  try {
    const result = await MocksService.persistBundle(req.query.qty);
    res.status(201).json(result);
  } catch (error) {
    res.status(error.status ?? 500).json({ message: error.message });
  }
};
