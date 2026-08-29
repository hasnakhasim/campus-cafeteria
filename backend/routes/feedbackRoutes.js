const express = require("express");
const router = express.Router();

const Feedback = require("../models/Feedback");

// =====================================================
// SUBMIT FEEDBACK
// =====================================================

router.post("/", async (req, res) => {
  try {
    const {
      userId,
      name,
      rating,
      comment,
    } = req.body;

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        message: "Name is required",
      });
    }

    if (!rating) {
      return res.status(400).json({
        message: "Rating is required",
      });
    }

    if (!comment) {
      return res.status(400).json({
        message: "Comment is required",
      });
    }

    const feedback =
      new Feedback({
        userId,
        name,
        rating,
        comment,
      });

    await feedback.save();

    res.status(201).json({
      message:
        "Feedback submitted successfully",
      feedback,
    });

  } catch (error) {

    console.error(
      "Feedback error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to submit feedback",
    });
  }
});


// =====================================================
// GET ALL FEEDBACK
// =====================================================

router.get("/", async (req, res) => {
  try {

    const feedback =
      await Feedback.find()
        .sort({
          createdAt: -1,
        });

    res.json({
      feedback,
    });

  } catch (error) {

    console.error(
      "Get feedback error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to load feedback",
    });
  }
});


module.exports = router;