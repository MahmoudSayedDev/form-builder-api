const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: String, required: true },
    finishForm: { type: Boolean, default: false },
  },
  { _id: false }
);

const fieldSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    icon: { type: String, default: "" },
    label: { type: String, required: true },
    placeholder: { type: String, default: "" },
    default_value: { type: mongoose.Schema.Types.Mixed, default: "" },
    required: { type: Boolean, default: false },
    readonly: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    min_length: { type: mongoose.Schema.Types.Mixed, default: "" },
    max_length: { type: mongoose.Schema.Types.Mixed, default: "" },
    min_value: { type: mongoose.Schema.Types.Mixed, default: "" },
    max_value: { type: mongoose.Schema.Types.Mixed, default: "" },
    regex_pattern: { type: String, default: "" },
    custom_error_messages: { type: String, default: "" },
    options: {
      type: [optionSchema],
      default: undefined,
    },
  },
  { _id: false, strict: false }
);

const formSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    fields: {
      type: [fieldSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("Form", formSchema);