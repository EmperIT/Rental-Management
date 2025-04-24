import * as mongoose from 'mongoose';

/**
 * Schema để lưu trữ các cấu hình dịch vụ cho hệ thống quản lý nhà trọ
 * Bao gồm các cấu hình như giá điện nước, lịch gửi hóa đơn, v.v.
 */
export const ServiceSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true 
  },
  value: { 
    type: mongoose.Schema.Types.Mixed, 
    required: true 
  },
  description: { 
    type: String 
  },
  lastUpdated: { 
    type: Date, 
    default: Date.now 
  },
}, { timestamps: true });