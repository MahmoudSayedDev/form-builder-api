const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    fieldId: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      required: true,
    },
    value: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { _id: false }
);

const responseSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    formId: {
      type: String,
      required: true,
      index: true,
    },
    answers: {
      type: [answerSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Response", responseSchema);