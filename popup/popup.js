// Parent elements
const chatBox = document.querySelector(".chat-box");
// Child elements of chatbox
const inputField = chatBox.querySelector("input[type='text']");
const button = chatBox.querySelector(".askBtn");
const chatBoxBody = chatBox.querySelector(".chat-box-body");
const url = "http://localhost:3000/message";

// Send message on button click
button.addEventListener("click", sendMessage);

// Send message on Enter key press
inputField.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

function sendMessage() {
  const message = inputField.value.trim();
  // Empty message handler
  if (!message) {
    return;
  } else {
    appendMessage(message, "user");
    inputField.value = "";
  }

  // Show loading message and disable inputs
  const loadingMessageDiv = appendMessage("Thinking ^_^ ....", "loading");
  button.disabled = true;
  inputField.disabled = true;

  // Setting up request parameters
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: message }),
  };

  // Send the message to the server
  fetch(url, request)
    .then(async (response) => {
      const data = await response.json();
      console.log(data);
      loadingMessageDiv.remove(); // Remove loading message
      appendMessage(
        data.choices[0].message.content, // gets the response of chatbot
        data.choices[0].message.role // gets the role of chatbot
      );
    })
    .catch((error) => {
      console.log(error);
      loadingMessageDiv.remove(); // Remove loading message
      appendMessage("An error was encountered!", "Error");
    })
    .finally(() => {
      // enable button and input field after response
      button.disabled = false;
      inputField.disabled = false;
    });
}

function appendMessage(text, sender) {
  // Creating a div for each chat and assigning class
  const messageDiv = document.createElement("div");
  const messagePara = document.createElement("p");
  messageDiv.className =
    sender === "user"
      ? "message"
      : sender === "assistant"
      ? "response"
      : sender === "error"
      ? "error"
      : "loading"; // For loading state
  messagePara.textContent = text;

  // Adding div to chatbox
  messageDiv.appendChild(messagePara);
  chatBoxBody.appendChild(messageDiv);

  // Scroll to bottom in chatbox
  chatBoxBody.scrollTop = chatBoxBody.scrollHeight;
  return messageDiv; // Return the message div for later removal
}
