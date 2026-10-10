const express = require("express");
const Response = require("../models/Response");
const Form = require("../models/Form");

const router = express.Router();

// GET /api/responses
// Get all responses
router.get("/", async (req, res, next) => {
  try {
    const responses = await Response.find().sort({
      createdAt: -1,
    });

    res.json(responses);
  } catch (error) {
    next(error);
  }
});

// GET /api/responses/form/:formId
// Get responses for a specific form
router.get("/form/:formId", async (req, res, next) => {
  try {
    const form = await Form.findOne({
      id: req.params.formId,
    });

    if (!form) {
      return res.status(404).json({
        message: "Form not found",
      });
    }

    const responses = await Response.find({
      formId: req.params.formId,
    }).sort({ createdAt: -1 });

    res.json(responses);
  } catch (error) {
    next(error);
  }
});

// GET /api/responses/:id
// Get one response
router.get("/:id", async (req, res, next) => {
  try {
    const response = await Response.findOne({
      id: req.params.id,
    });

    if (!response) {
      return res.status(404).json({
        message: "Response not found",
      });
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// POST /api/responses
// Create a new response
router.post("/", async (req, res, next) => {
  try {
    const { id, formId, answers } = req.body;

    if (!formId || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "formId and answers array are required",
      });
    }

    // Check if the form exists
    const form = await Form.findOne({ id: formId });

    if (!form) {
      return res.status(404).json({
        message: "Form not found",
      });
    }

    // Generate an ID if the client did not send one
    const responseId =
      id || require("crypto").randomUUID();

    const response = await Response.create({
      id: responseId,
      formId,
      answers,
    });

    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
});

// PATCH /api/responses/:id
// Update selected response properties
router.patch("/:id", async (req, res, next) => {
  try {
    const { id, _id, createdAt, updatedAt, ...updates } =
      req.body;

    if (
      updates.answers !== undefined &&
      !Array.isArray(updates.answers)
    ) {
      return res.status(400).json({
        message: "answers must be an array",
      });
    }

    if (updates.formId !== undefined) {
      const form = await Form.findOne({
        id: updates.formId,
      });

      if (!form) {
        return res.status(404).json({
          message: "Form not found",
        });
      }
    }

    const response = await Response.findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!response) {
      return res.status(404).json({
        message: "Response not found",
      });
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// PUT /api/responses/:id
// Replace the whole response
router.put("/:id", async (req, res, next) => {
  try {
    const { formId, answers } = req.body;

    if (!formId || !Array.isArray(answers)) {
      return res.status(400).json({
        message: "formId and answers array are required",
      });
    }

    const form = await Form.findOne({ id: formId });

    if (!form) {
      return res.status(404).json({
        message: "Form not found",
      });
    }

    const response = await Response.findOneAndReplace(
      { id: req.params.id },
      {
        id: req.params.id,
        formId,
        answers,
      },
      { new: true, runValidators: true }
    );

    if (!response) {
      return res.status(404).json({
        message: "Response not found",
      });
    }

    res.json(response);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/responses/:id
router.delete("/:id", async (req, res, next) => {
  try {
    const response = await Response.findOneAndDelete({
      id: req.params.id,
    });

    if (!response) {
      return res.status(404).json({
        message: "Response not found",
      });
    }

    res.json({
      message: "Response deleted successfully",
      id: response.id,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;