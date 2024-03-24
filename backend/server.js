const express = require('express');
const cron = require('node-cron');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const usersRouter = require('./routes/usersRouter');
const connectDB = require('./utils/connectDB');
const openAIRouter = require('./routes/openAIRouter');
const { stripeRouter } = require('./routes/stripeRouter');
const User = require('./models/User');

const app = express();
connectDB();
const PORT = 5000;

//Cron for trial Period: run every single day
cron.schedule('0 0 * * * *', async () => {
  // console.log('runs every day');
  try {
    //get current date
    const today = new Date();

    //get all users with trial active
    const updatedUser = await User.updateMany(
      {
        trialActive: true,
        trialExpires: { $lt: today },
      },
      {
        trialActive: false,
        subscriptionPlan: 'Free',
        monthlyRequuestCount: 5,
      }
    );
    console.log(updatedUser);
  } catch (error) {
    console.log(error);
  }
});

//Cron for Free Plan: run at the end of every month
cron.schedule('0 0 1 * * *', async () => {
  // console.log('runs at end of month');
  try {
    //get current date
    const today = new Date();

    //get all users with trial active
    await User.updateMany(
      {
        subscriptionPlan: 'Free',
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequuestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Cron for Basic Plan: run at the end of every month
cron.schedule('0 0 1 * * *', async () => {
  // console.log('runs at end of month');
  try {
    //get current date
    const today = new Date();

    //get all users with trial active
    await User.updateMany(
      {
        subscriptionPlan: 'Basic',
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequuestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//Cron for Premium Plan: run at the end of every month
cron.schedule('0 0 1 * * *', async () => {
  // console.log('runs at end of month');
  try {
    //get current date
    const today = new Date();

    //get all users with trial active
    await User.updateMany(
      {
        subscriptionPlan: 'Premium',
        nextBillingDate: { $lt: today },
      },
      {
        monthlyRequuestCount: 0,
      }
    );
  } catch (error) {
    console.log(error);
  }
});

//-------Middlewares--------------
app.use(express.json());
app.use(cookieParser());
const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
};
app.use(cors(corsOptions));

//-----Routes---------
app.use('/api/users', usersRouter);
app.use('/api/openai', openAIRouter);
app.use('/api/stripe', stripeRouter);

app.listen(PORT, console.log(`Server is running on port ${PORT}`));
