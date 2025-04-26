import { Schema } from 'mongoose';

export const RoomSchema = new Schema({
  roomNumber: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  area: { type: Number, required: true },
  images: { type: [String], default: [], required: false },
  depositPrice: { type: Number, required: true },
  maxTenants: { type: Number, required: true },
  isEmpty: { type: Boolean, required: true, default: 'true' },
  depositDate: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});