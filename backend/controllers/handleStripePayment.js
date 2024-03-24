const asyncHandler = require('express-async-handler');
const {
  calculatNextBillingDate,
} = require('../utils/calculateNextBillingDate');
const {
  shouldRenewSubscriptionPlan,
} = require('../utils/shouldRenewSubscriptionPlan');
const Payment = require('../models/payment');
const User = require('../models/User');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

//---------Stripe Payment-------------
const handleStripePayment = asyncHandler(async (req, res) => {
  const { amount, subscriptionPlan } = req.body;
  //get the user
  const user = req?.user;
  try {
    //Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Number(amount) * 100,
      currency: 'INR',
      statement_descriptor_suffix: 'Payment uing Stripe',
      automatic_payment_methods: {
        enabled: true,
      },
      //add some data to meta object
      metadata: {
        userId: user?._id?.toString(),
        userEmail: user?.email,
        subscriptionPlan,
      },
    });
    console.log(paymentIntent);
    //send the response
    res.status(200).json({
      clientSecret: paymentIntent?.client_secret,
      paymentId: paymentIntent?.id,
      metadata: paymentIntent?.metadata,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

//---------verify payment--------------
const verifyPayment = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;
  console.log(paymentId, 'in backend');
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
    console.log(paymentIntent, 'paymentID');
    if (paymentIntent.status === 'succeeded') {
      //get the info metadata
      const metadata = paymentIntent?.metadata;
      const { subscriptionPlan, userEmail, userId } = metadata;

      //find the user
      const userFound = await User.findById(userId);
      if (!userFound) {
        res.status(400).json({
          status: false,
          message: 'User not found',
        });
      }

      //get the payment details

      const amount = paymentIntent?.amount / 100;
      const currency = paymentIntent?.currency;
      const paymentId = paymentIntent?.id;

      //craete a payment history
      const newPayment = await Payment.create({
        user: userId,
        email: userEmail,
        subscriptionPlan,
        amount,
        currency,
        status: 'success',
        reference: paymentId,
      });

      //check for subscription plan
      if (subscriptionPlan === 'Basic') {
        //update the user
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          monthlyRequuestCount: 50,
          subscriptionPlan: 'Basic',
          apiRequestCount: 0,
          nextBillingDate: calculatNextBillingDate(),
          $addToSet: { payments: newPayment?._id },
        });

        res.json({
          status: true,
          message: 'Payment verified, user updated',
          updatedUser,
        });
      }

      if (subscriptionPlan === 'Premium') {
        //update the user
        const updatedUser = await User.findByIdAndUpdate(userId, {
          subscriptionPlan,
          trialPeriod: 0,
          monthlyRequuestCount: 100,
          subscriptionPlan: 'Premium',
          apiRequestCount: 0,
          nextBillingDate: calculatNextBillingDate(),
          $addToSet: { payments: newPayment?._id },
        });

        res.json({
          status: true,
          message: 'Payment verified, user updated',
          updatedUser,
        });
      }
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: 'Unable to verify payment',
      error: error,
    });
  }
});

//----------Handle Free Subscription------------
const handleFreeSubscription = asyncHandler(async (req, res) => {
  //get the login user
  const user = req?.user;
  // console.log(user);
  //check if user account should be renew or not
  try {
    if (shouldRenewSubscriptionPlan(user)) {
      // update the user account
      user.subscriptionPlan = 'Free';
      user.monthlyRequuestCount = 5;
      user.apiRequestCount = 0;
      user.nextBillingDate = calculatNextBillingDate();

      //Create new payment and save into db
      const newPayment = await Payment.create({
        userId: user?._id,
        amount: 0,
        currency: 'INR',
        status: 'success',
        subscriptionPlan: 'Free',
        reference: Math.random().toString(36).substring(7),
        monthlyRequuestCount: 5,
      });
      user.payments.push(newPayment?._id);

      //save the user
      await user.save();
      //send the response
      res.status(200).json({
        status: true,
        message: 'Subscription plan updated successfully',
        user,
      });
    } else {
      res.status(403).json({
        status: false,
        message: 'Subscription renewal not due yet',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

module.exports = { handleStripePayment, handleFreeSubscription, verifyPayment };
