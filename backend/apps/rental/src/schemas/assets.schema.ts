import * as mongoose from 'mongoose';
import { min } from 'rxjs';

/**
 * Schema để lưu trữ các tài sản của nhà trọ
 * Bao gồm các tài sản như bàn ghế, tủ lạnh, máy giặt, v.v.
 */

export const AssetSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  value: { 
    type: Number, 
    required: true, 
    min: 0
  },
  unit: {
    type: String,
    default: ''
  },
}, { timestamps: true });