const express = require("express");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const User = require("../models/User");

const router = express.Router();


// =====================================================
// CREATE ORDER
// POST /api/orders
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      items,
      totalAmount,
      pickupTime,
    } = req.body;

    // -----------------------------------------------
    // CHECK USER ID
    // -----------------------------------------------

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        message: "Invalid User ID",
      });
    }

    // -----------------------------------------------
    // CHECK USER
    // -----------------------------------------------

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // -----------------------------------------------
    // CHECK ITEMS
    // -----------------------------------------------

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "At least one food item is required",
      });
    }

    // -----------------------------------------------
    // CREATE ORDER
    // -----------------------------------------------

    const order = new Order({
      userId: userId,
      items: items,
      totalAmount: Number(totalAmount) || 0,
      pickupTime: pickupTime || "",
      status: "Pending",
    });

    const savedOrder = await order.save();

    // Return user information also
    const populatedOrder = await Order.findById(
      savedOrder._id
    ).populate(
      "userId",
      "name email"
    );

    res.status(201).json({
      message: "Order placed successfully",
      order: populatedOrder,
    });

  } catch (error) {
    console.error(
      "Create order error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
});


// =====================================================
// GET ALL ORDERS
// GET /api/orders
// =====================================================

router.get("/", async (req, res) => {
  try {

    const orders = await Order.find()
      .populate(
        "userId",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.json({
      orders: orders,
    });

  } catch (error) {

    console.error(
      "Get orders error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
});


// =====================================================
// GET MY ORDERS
// GET /api/orders/my-orders/:userId
// =====================================================

router.get(
  "/my-orders/:userId",
  async (req, res) => {

    try {

      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          message: "User ID is required",
        });
      }

      if (
        !mongoose.Types.ObjectId.isValid(
          userId
        )
      ) {
        return res.status(400).json({
          message: "Invalid User ID",
        });
      }

      const orders = await Order.find({
        userId: userId,
      })
        .populate(
          "userId",
          "name email"
        )
        .sort({
          createdAt: -1,
        });

      res.json({
        orders: orders,
      });

    } catch (error) {

      console.error(
        "My orders error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// =====================================================
// UPDATE ORDER STATUS
// PUT /api/orders/:id/status
// =====================================================

router.put(
  "/:id/status",
  async (req, res) => {

    try {

      const { id } = req.params;
      const { status } = req.body;

      // -----------------------------------------------
      // CHECK ORDER ID
      // -----------------------------------------------

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          message: "Invalid Order ID",
        });
      }

      // -----------------------------------------------
      // CHECK STATUS
      // -----------------------------------------------

      const allowedStatuses = [
        "Pending",
        "Preparing",
        "Ready",
        "Collected",
        "Cancelled",
      ];

      if (
        !allowedStatuses.includes(status)
      ) {
        return res.status(400).json({
          message: "Invalid order status",
        });
      }

      // -----------------------------------------------
      // UPDATE ORDER
      // -----------------------------------------------

      const order =
        await Order.findByIdAndUpdate(
          id,
          {
            status: status,
          },
          {
            new: true,
          }
        ).populate(
          "userId",
          "name email"
        );

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message:
          "Order status updated successfully",
        order: order,
      });

    } catch (error) {

      console.error(
        "Update status error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


// =====================================================
// DELETE ORDER
// DELETE /api/orders/:id
// =====================================================

router.delete(
  "/:id",
  async (req, res) => {

    try {

      const { id } = req.params;

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          message: "Invalid Order ID",
        });
      }

      const order =
        await Order.findByIdAndDelete(id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json({
        message:
          "Order deleted successfully",
      });

    } catch (error) {

      console.error(
        "Delete order error:",
        error
      );

      res.status(500).json({
        message: error.message,
      });
    }
  }
);


module.exports = router;