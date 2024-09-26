//for api server errors
const errorHandler = (err, req, res) => {
  console.error("Server error:", err);
  if (err.response) {
    res.status(err.response.status).send(err.response.data.error.message);
  } else if (err.request) {
    res.status(500).send("No response received from the API.");
  } else {
    res.status(500).send("An unexpected error occurred.");
  }
};

// for 404 errors
const notFound = (req, res) => {
  res.status(404).json({ error: "Error 404: Not Found!" });
};

module.exports = { errorHandler, notFound };
