const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAuthenticated = asyncHandler(async (req, res, next) => {
  // console.log(req.cookies.token, 'token');
  if (req.cookies.token) {
    //!Verify the token
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET); //the actual login user
    // console.log('isAuthenticated');
    // add the user to req obj
    req.user = await User.findById(decoded?.id).select('-password');
    return next();
  } else {
    res.status(401).json({
      status: false,
      message: 'Unauthorized, No Token',
    });
  }
});

module.exports = isAuthenticated;
