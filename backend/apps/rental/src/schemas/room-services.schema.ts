import * as mongoose from 'mongoose';

/**
 * Schema lưu dịch vụ được đăng ký cho từng phòng
 * Ví dụ: phòng 101 có gửi 2 xe, phòng 102 có internet 
 */
export const RoomServiceSchema = new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true,
    index: true
  },
  serviceName: { 
    type: String, 
    required: true,
    index: true
  },
  quantity: { 
    type: Number, 
    default: 1
  },
  customPrice: {
    type: Number,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
}, { timestamps: true });

// Tạo index kết hợp để đảm bảo mỗi phòng chỉ có một dịch vụ cùng tên
RoomServiceSchema.index({ roomId: 1, serviceName: 1 }, { unique: true });