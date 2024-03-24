const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//schema
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    trialPeriod: {
      type: Number,
      default: 3,
    },
    trialActive: {
      type: Boolean,
      default: true,
    },
    trialExpires: {
      type: Date,
    },
    subscriptionPlan: {
      type: String,
      enum: ['Trial', 'Free', 'Basic', 'Premium'],
      default: 'Trial',
    },
    apiRequestCount: {
      type: Number,
      default: 0,
    },
    monthlyRequuestCount: {
      type: Number,
      default: 100, //100 credits for 3 days
    },
    nextBillingDate: Date,
    payments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Payment',
      },
    ],
    contentHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContentHistory',
      },
    ],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

//! Compile to form the model
const User = mongoose.model('User', userSchema);

module.exports = User;
