import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export const ContractSchema = new Schema({
  contract_id: { type: String, default: uuidv4, unique: true },
  is_active: { type: Boolean, default: true },
  room_id: { type: String, required: true },
  content: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  deposit: { type: Number, required: true },
  rent_amount: { type: Number, required: true },
  template_id: { type: String, required: true },
});