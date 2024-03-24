const asyncHandler = require('express-async-handler');
const User = require('../models/User');

const checkApiRequestLimit = asyncHandler(async (req, res, next) => {
  // console.log(req.user);
  if (!req.user) {
    return res.status(401).json({
      status: false,
      message: 'Unauthorized',
    });
  }

  //find the user
  const user = await User.findById(req?.user?._id);
  if (!user) {
    return res.status(404).json({
      status: false,
      message: 'User not found',
    });
  }

  let requestLimit = 0;

  //check if user is on trial period
  if (user?.trialActive) {
    requestLimit = user?.monthlyRequuestCount;
  }

  //check if user has exceeded monthly request limit
  if (user?.apiRequestCount >= requestLimit) {
    return res.status(429).json({
      status: false,
      message: 'API Request limit Reached, please subscribe to a plan ',
    });
  }

  next();
});

module.exports = { checkApiRequestLimit };
