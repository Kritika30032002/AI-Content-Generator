const express = require('express');
const isAuthenticated = require('../middlewares/isAuthenticated');
const { openAIController } = require('../controllers/openAIController');
const { checkApiRequestLimit } = require('../middlewares/checkApiRequestLimit');

const openAIRouter = express.Router();

openAIRouter.get(
  '/generate-content',
  isAuthenticated,
  checkApiRequestLimit,
  openAIController
);

module.exports = openAIRouter;
