document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const chatSendBtn = document.getElementById("chat-send-btn");
  const chatMessages = document.getElementById("chat-messages");

  let step = 0;
  let userData = { name: "", type: "", phone: "" };

  function appendMessage(sender, text) {
    let div = document.createElement("div");
    div.className = "chat-message " + sender;
    div.innerText = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    appendMessage("user", text);
    chatInput.value = "";

    if (step === 0) {
      userData.name = text;
      appendMessage("eva", "Приємно познайомитись, " + text + "! Який вид страховки вас цікавить?");
      step = 1;
    } else if (step === 1) {
      userData.type = text;
      appendMessage("eva", "Супер! Будь ласка, залиште свій номер телефону 📞");
      step = 2;
    } else if (step === 2) {
      userData.phone = text;
      appendMessage("eva", "Дякую! Відправляю ваші дані оператору… ⏳");
      step = 3;
      sendToTelegram();
    }
  }

  function sendToTelegram() {
    fetch("/api/sendTelegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData)
    })
    .then(res => res.json())
    .then(data => console.log("Telegram response:", data))
    .catch(err => console.error("Telegram error:", err));
  }

  chatSendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", e => { if(e.key==="Enter") sendMessage(); });
});
