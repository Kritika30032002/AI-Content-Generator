const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//schema
const historySchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

//! Compile to form the model
const ContentHistory = mongoose.model('ContentHistory', historySchema);

module.exports = ContentHistory;
