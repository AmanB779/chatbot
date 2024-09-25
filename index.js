// server.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const { errorHandler, notFound } = require("./middlewares/errorHandler.js");
const limiter = require("./middlewares/rateLimit.js");

const app = express();
const port = 3000;

// setting up middlewares
app.use(bodyParser.json());
app.use(cors());

app.post("/message", limiter, async (req, res, next) => {
  const query = req.body.query;
  const url = "https://api.openai.com/v1/chat/completions";

  const options = {
    method: "POST",
    url: url,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.API_KEY}`,
    },
    data: {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: query },
      ],
      // response_format: { "type": "json_object" }, // response format type //issue line
      temperature: 0.5, //randomizer
      frequency_penalty: 1, //penalty for repetition
      max_completion_tokens: 128, //limit of response tokens
      n: 1, //number of response per query
    },
  };

  try {
    const response = await axios(options);
    console.log(response.data);
    res.json(response.data);
  } catch (err) {
    console.error("Fetch error:", err);
    next(err); // passing error to error handler
  }
});

app.use(notFound); //catch 404 errors
app.use(errorHandler); //catch api errors

app.listen(port, () => console.log(`Listening on port ${port}`)); //port listenr
