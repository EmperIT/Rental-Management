import { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

/**
 * Schema để lưu trữ thông tin tạm trú của người thuê
 */
export const StayRecordSchema = new Schema({
  stayId: { 
    type: String, 
    default: () => uuidv4(), 
    unique: true,
    index: true
  },
  tenantId: { 
    type: String, 
    required: true,
    index: true 
  },
  startDate: { 
    type: Date, 
    required: true,
    index: true 
  },
  endDate: { 
    type: Date, 
    required: true,
    index: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'expired', 'inactive'],
    default: 'active',
    index: true
  },
  content: { 
    type: String, 
    default: '' 
  },
  createdBy: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index hỗ trợ tìm kiếm bản ghi theo khoảng thời gian
StayRecordSchema.index({ startDate: 1, endDate: 1 });

// Index hỗ trợ tìm kiếm bản ghi active của tenant
StayRecordSchema.index({ tenantId: 1, status: 1 });