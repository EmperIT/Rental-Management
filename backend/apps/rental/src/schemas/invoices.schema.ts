import { Schema } from 'mongoose';

const FeeSchema = new Schema({
  type: { type: String, required: true },
  amount: { type: Number, required: true },
  reading: { type: Number },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const InvoiceSchema = new Schema({
  roomId: { type: Schema.Types.ObjectId, required: true, ref: 'Room' },
  month: { type: String, required: true },
  fees: { type: [FeeSchema], required: true },
  total: { type: Number, required: true },
  dueDate: { type: String, required: true },
  isPaid: { type: Boolean, default: false },
  paidAt: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});