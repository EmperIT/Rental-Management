import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const ContractSchema = new Schema({
  contractId: { type: String, default: uuidv4, unique: true },
  isActive: { type: Boolean, default: true },
  roomId: { type: String, required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  deposit: { type: Number, required: true },
  rentAmount: { type: Number, required: true },
  templateId: { type: String, required: true },
});