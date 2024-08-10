import { Product } from './product.model.js';

import mongoose, { Schema } from 'mongoose';

// Order Schema for storing order-related information
const customerSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  contact: {
    type: String,
    required: true,
  },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: customerSchema, // Customer information
      required: true,
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, // Ensuring ObjectId
        name: String,
        quantity: Number,
        price:Number,
        size: String,
        color: String,
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'Dispatched', 'Delivered', 'Cancelled'], // Valid order statuses
      default: 'Pending', // Default status
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Auto-manage createdAt and updatedAt fields
  }
);

export const Order = mongoose.model('Order', orderSchema);
