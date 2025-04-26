import * as mongoose from 'mongoose';

export const TransactionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['income', 'expense'],
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: '',
    },
    relatedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Invoice',
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Auth',
      default: null, // null nếu hệ thống tạo
    }
  },
  { timestamps: true }
);