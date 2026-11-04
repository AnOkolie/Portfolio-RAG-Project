import { BASE_API } from "./config";
const toggleBtn = document.getElementById("chatToggle");
const chatBox = document.getElementById("chatbox");
const input = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const closeBtn = document.getElementById("close-chat");
const chatBody = document.getElementById("chat-body");
function toggleChat() {
  // chatBox.classList.toggle("active");
  window.location.href = `${BASE_API}/terminal.html`;
}

function appendMessage(text, sender) {
  const messageElement = document.createElement("div");
  messageElement.classList.add("message", sender);
  messageElement.innerText = text;
  messageElement.style.display = "flex";

  if (sender === "user") {
    messageElement.style.justifyContent = "flex-end";
    messageElement.style.background = "white";
    messageElement.style.width = "max-content";
  } else {
    messageElement.style.justifyContent = "flex-start";
    messageElement.style.background = "grey";
    messageElement.style.width = "max-content";
  }
  chatBody.appendChild(messageElement);
  chatBody.scrollTo({
    top: chatBody.scrollHeight,
    behavior: "smooth",
  });
}

async function sendMessage() {
  const text = input.value.trim();
  if (!text) return;
  appendMessage(text, "user");
  input.value = "";
  try {
    const response = await fetch(`${BASE_API}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await response.json();
    if (data.reply) {
      appendMessage(data.reply, "bot");
    } else {
      appendMessage("Error: Could not retrieve response.", "bot");
    }
  } catch (error) {
    appendMessage("Error connecting to server.", "bot");
  }
}
toggleBtn.addEventListener("click", toggleChat);
closeBtn.addEventListener("click", toggleChat);
sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendMessage();
});
