import axios from 'axios';

// ----------Stripe Payment-----------------
export const handleFreeSubscriptionAPI = async () => {
  const response = await axios.post(
    'http://localhost:5000/api/stripe/free-plan',
    {},
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

// ----------Stripe Payment intent--------------
export const createStripePaymentIntentAPI = async (payment) => {
  const response = await axios.post(
    'http://localhost:5000/api/stripe/checkout',
    {
      amount: Number(payment?.amount),
      subscriptionPlan: payment?.subscriptionPlan,
    },
    {
      withCredentials: true,
    }
  );
  return response?.data;
};

// ----------verify Payment--------------
export const verifyPaymentAPI = async (paymentId) => {
  console.log(paymentId, 'verifyAPI');

  const response = await axios.post(
    `http://localhost:5000/api/stripe/verify-payment/${paymentId}`,
    {},
    {
      withCredentials: true,
    }
  );
  console.log(response);
  return response?.data;
};
