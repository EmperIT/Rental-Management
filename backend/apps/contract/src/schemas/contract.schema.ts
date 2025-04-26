import { Schema } from 'mongoose';

export const ContractSchema = new Schema({
  isActive: { type: Boolean, default: true },
  roomId: { type: String, required: true },
  tenantId: { type: String, required: true },
  content: { type: String, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true }
});