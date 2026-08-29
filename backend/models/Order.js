const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Student who placed the order
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Food items in the order
    items: [
      {
        itemName: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    // Total order amount
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    // Student's pickup time
    pickupTime: {
      type: String,
      required: true,
    },

    // Order status
    status: {
      type: String,
      enum: [
        "Pending",
        "Preparing",
        "Ready",
        "Collected",
        "Cancelled",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model(
  "Order",
  orderSchema
);

module.exports = Order;