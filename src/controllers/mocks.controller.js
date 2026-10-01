import { MocksService } from "../services/mock.service.js";

export const GetMocks = async (req, res) => {
  try {
    const mocks = await MocksService.getMocks();
    res.json(mocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const GetMockById = async (req, res) => {
  try {
    const mock = await MocksService.getMockById(req.params.id);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const CreateMock = async (req, res) => {
  try {
    const newMock = await MocksService.createMock(req.body);
    res.status(201).json(newMock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const UpdateMock = async (req, res) => {
  try {
    const updatedMock = await MocksService.updateMock(req.params.id, req.body);
    res.json(updatedMock);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const DeleteMock = async (req, res) => {
  try {
    await MocksService.deleteMock(req.params.id);
    res.status(200).json({ message: "Mock deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
