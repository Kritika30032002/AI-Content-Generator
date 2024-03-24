const asyncHandler = require('express-async-handler');
const axios = require('axios');
const ContentHistory = require('../models/ContentHistory');
const User = require('../models/User');

const openAIController = asyncHandler(async (req, res) => {
  const { prompt } = req.query;

  // console.log(prompt, 'prompt');
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/completions',
      {
        model: 'gpt-3.5-turbo-instruct',
        prompt,
        max_tokens: 10,
        temperature: 0.7,
        n: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    //send the response
    const content = response?.data?.choices[0].text?.trim();
    //create the history
    const newContent = await ContentHistory.create({
      user: req?.user?._id,
      content,
    });
    //push the content into user
    const userFound = await User.findById(req?.user?._id);
    userFound.contentHistory.push(newContent?._id);

    //update the api request count
    userFound.apiRequestCount++;

    await userFound.save();

    //send the response
    res
      .status(200)
      .json({ status: 'Data fetched Succesfully', content: content });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ error: error });
  }
});

module.exports = { openAIController };
