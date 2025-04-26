import * as mongoose from 'mongoose';

/**
 * Schema để lưu trữ các tài sản của phòng trọ
 * Bao gồm các tài sản như bàn ghế, tủ lạnh, máy giặt, v.v.
 */

export const RoomAssetSchema = new mongoose.Schema({
  roomId: { 
    type: String, 
    required: true,
    index: true
  },
  assetName: { 
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