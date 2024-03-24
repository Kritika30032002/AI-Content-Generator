//-------Register----------

const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    //validate
    if (!email || !password || !username) {
      res.status(400);
      throw new Error('All fields are required');
    }
    // Check the email is already taken
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    //Hash the user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
    });

    //add the date the trial will end
    newUser.trialExpires = new Date(
      new Date().getTime() + newUser.trialPeriod * 24 * 60 * 60 * 1000
    );

    //save the new user
    await newUser.save();

    res.status(200).json({
      status: true,
      message: 'Registration successfull',
      user: {
        username,
        email,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

//-------Login----------

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    //check if password is correct
    const isMatch = await bcrypt.compare(password, user?.password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    //Generate JWT token
    const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
      expiresIn: '3d', //expires in 3 days
    });
    // console.log(token);

    //set the token into cookie(http only)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 1000 * 60 * 60 * 24, //1 day
    });

    //send the response
    res.status(200).json({
      status: 'Success',
      _id: user?._id,
      message: 'Login successfull',
      username: user?.username,
      email: user?.email,
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

//-------Logout----------

const logout = async (req, res) => {
  try {
    await res.clearCookie('token');
    res.status(200).json({
      message: 'User logged out successfully',
    });
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

//--------Profile----------
const userProfile = async (req, res) => {
  try {
    const user = await User.findById(req?.user?._id)
      .select('-password')
      .populate('payments')
      .populate('contentHistory');
    if (user) {
      res.status(200).json({
        status: 'User Found Successfully',
        user,
      });
    } else {
      res.status(401);
      throw new Error('User not found');
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

//--------Check user Auth Status----------
const checkAuth = async (req, res) => {
  try {
    const decoded = jwt.verify(req.cookies.token, process.env.JWT_SECRET);
    if (decoded) {
      res.json({
        isAuthenticated: true,
      });
    } else {
      res.json({
        isAuthenticated: false,
      });
    }
  } catch (error) {
    res.status(400).json({
      status: false,
      message: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  logout,
  userProfile,
  checkAuth,
};
