const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//schema
const paymentSchema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reference: {
      type: String,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
      required: true,
    },
    subscriptionPlan: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      default: 0,
    },

    monthlyRequuestCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

//! Compile to form the model
const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
