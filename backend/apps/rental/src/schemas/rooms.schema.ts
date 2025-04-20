import { Schema } from 'mongoose';

export const RoomSchema = new Schema({
  roomNumber: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  address: { type: String, required: true },
  isEmpty: { type: Boolean, required: true, default: 'true' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});