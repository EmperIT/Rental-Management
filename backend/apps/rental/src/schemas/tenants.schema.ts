import { Schema } from 'mongoose';

export const TenantSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  roomId: { type: Schema.Types.ObjectId, required: true, ref: 'Room' },
  isLeadRoom: { type: Boolean, required: true, default: 'false' },
  identityNumber: { type: String, required: true },
  permanentAddress: { type: String, required: true },
  holdingDepositPrice: { type: Number, required: true },
  depositDate: { type: Date, default: null },
  startDate: { type: Date, default: null },
  birthday: { type: Date, default: null },
  gender: { type: String, default: "Nam" },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});