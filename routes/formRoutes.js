const express = require("express");
const mongoose = require("mongoose");
const Form = require("../models/Form");

const router = express.Router();

// GET: Get all forms
router.get("/", async (req, res, next) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (error) {
    next(error);
  }
});

// GET: Get one form
router.get("/:id", async (req, res, next) => {
  try {
    const form = await Form.findOne({ id: req.params.id });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(form);
  } catch (error) {
    next(error);
  }
});

// POST: Create a form
router.post("/", async (req, res, next) => {
  try {
    const form = await Form.create(req.body);
    res.status(201).json(form);
  } catch (error) {
    next(error);
  }
});

// PUT: Replace a form
router.put("/:id", async (req, res, next) => {
  try {
    const { id, _id, createdAt, updatedAt, ...data } = req.body;

    const form = await Form.findOneAndReplace(
      { id: req.params.id },
      { ...data, id: req.params.id },
      { new: true, runValidators: true }
    );

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(form);
  } catch (error) {
    next(error);
  }
});

// PATCH: Update selected properties
router.patch("/:id", async (req, res, next) => {
  try {
    const { _id, id, createdAt, updatedAt, ...updates } = req.body;

    const form = await Form.findOneAndUpdate(
      { id: req.params.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json(form);
  } catch (error) {
    next(error);
  }
});

// DELETE: Delete a form
router.delete("/:id", async (req, res, next) => {
  try {
    const form = await Form.findOneAndDelete({ id: req.params.id });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json({ message: "Form deleted successfully", id: form.id });
  } catch (error) {
    next(error);
  }
});

// POST: Add a field to a form
router.post("/:id/fields", async (req, res, next) => {
  try {
    const form = await Form.findOne({ id: req.params.id });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    if (!req.body.id) {
      return res.status(400).json({ message: "Field id is required" });
    }

    if (form.fields.some((field) => field.id === req.body.id)) {
      return res.status(409).json({ message: "Field id already exists" });
    }

    form.fields.push(req.body);
    await form.save();

    res.status(201).json(form);
  } catch (error) {
    next(error);
  }
});

// PATCH: Update a field
router.patch("/:id/fields/:fieldId", async (req, res, next) => {
  try {
    const { id, _id, ...updates } = req.body;

    const form = await Form.findOne({ id: req.params.id });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const field = form.fields.find(
      (item) => item.id === req.params.fieldId
    );

    if (!field) {
      return res.status(404).json({ message: "Field not found" });
    }

    field.set(updates);
    await form.save();

    res.json(form);
  } catch (error) {
    next(error);
  }
});

// DELETE: Delete a field
router.delete("/:id/fields/:fieldId", async (req, res, next) => {
  try {
    const form = await Form.findOne({ id: req.params.id });

    if (!form) {
      return res.status(404).json({ message: "Form not found" });
    }

    const fieldExists = form.fields.some(
      (field) => field.id === req.params.fieldId
    );

    if (!fieldExists) {
      return res.status(404).json({ message: "Field not found" });
    }

    form.fields = form.fields.filter(
      (field) => field.id !== req.params.fieldId
    );

    await form.save();

    res.json({ message: "Field deleted successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;