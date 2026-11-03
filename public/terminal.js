import { BASE_API } from "./config.js";
const output = document.getElementById("chat-output");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");

function appendMessage(text, role, extraClass = "") {
  const entry = document.createElement("div");
  entry.className = `chat-entry ${role}${extraClass ? ` ${extraClass}` : ""}`;
  entry.textContent = text;
  output.appendChild(entry);
  output.scrollTop = output.scrollHeight;
  return entry;
}

async function sendMessage(message) {
  const text = message.trim();
  if (!text) return;

  document
    .querySelectorAll(".suggestions")
    .forEach((suggestions) => suggestions.remove());
  appendMessage(text, "user");
  input.value = "";
  input.disabled = true;
  const pending = appendMessage("Thinking", "assistant", "typing");

  try {
    const response = await fetch(`${BASE_API}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });
    const data = await response.json();
    pending.remove();
    if (!response.ok)
      throw new Error(data.error || "The assistant could not respond.");
    appendMessage(
      data.reply || "I couldn't generate a response. Please try again.",
      "assistant",
    );
  } catch (error) {
    pending.remove();
    appendMessage(
      error.message ||
        "Could not connect to the chat server. Please try again.",
      "assistant",
      "error",
    );
  } finally {
    input.disabled = false;
    input.focus();
  }
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  sendMessage(input.value);
});

document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => sendMessage(button.dataset.prompt));
});
