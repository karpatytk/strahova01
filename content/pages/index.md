---
title: "Головна"
---

# Ласкаво просимо на сайт **Страхування 360**!

Ми допомагаємо швидко та зручно оформити:
- Автоцивілку  
- Зелену карту  
- Туристичне страхування  
- Страхування майна  
- Інші види страхових продуктів  

Нижче — інтерактивний чат із оператором **Єва**, яка збере ваші дані та передасть їх нашому менеджеру.

---

<!-- ======== ІНТЕРАКТИВНИЙ ЧАТ ЄВА ======== -->

<style>
.chat-box {
  max-width: 380px;
  width: 100%;
  border-radius: 20px;
  border: 1px solid #ccc;
  padding: 20px;
  background: #fff;
  font-family: Arial;
  box-shadow: 0 0 15px rgba(0,0,0,0.1);
  margin-top: 30px;
}
.chat-message {
  margin-bottom: 12px;
  line-height: 1.4;
}
.eva {
  background: #f0f0f0;
  padding: 10px 14px;
  border-radius: 12px;
  display: inline-block;
}
.user {
  background: #d0f1d0;
  padding: 10px 14px;
  border-radius: 12px;
  display: inline-block;
  align-self: flex-end;
}
.chat-input {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #aaa;
  margin-top: 10px;
}
#sendBtn {
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 10px;
  background: #4CAF50;
  color: white;
  font-size: 16px;
  margin-top: 6px;
  cursor: pointer;
}
</style>

<div class="chat-box">
  <div id="chatArea">
    <div class="chat-message eva">Привіт! Я оператор Єва 😊  
      <br>Я допоможу вам оформити страховку.  
      <br>Як вас звати?</div>
  </div>

  <input id="chatInput" class="chat-input" placeholder="Ваша відповідь..." />
  <button id="sendBtn">Надіслати</button>
</div>

<script>
let step = 0;
let userData = { name: "", type: "", phone: "" };

document.getElementById("sendBtn").onclick = sendMessage;

function addMessage(text, sender) {
  let div = document.createElement("div");
  div.className = "chat-message " + sender;
  div.innerHTML = text;
  document.getElementById("chatArea").appendChild(div);
  div.scrollIntoView({behavior: "smooth"});
}

function sendMessage() {
  let input = document.getElementById("chatInput");
  let text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  if (step === 0) {
    userData.name = text;
    setTimeout(() => addMessage("Приємно познайомитись, " + text + "! 😊<br>Який вид страховки вас цікавить?", "eva"), 500);
    step = 1;
  }
  else if (step === 1) {
    userData.type = text;
    setTimeout(() => addMessage("Супер! Тепер, будь ласка, залиште свій номер телефону 📞", "eva"), 500);
    step = 2;
  }
  else if (step === 2) {
    userData.phone = text;
    setTimeout(() => addMessage("Дякую! Секундочку, відправляю ваші дані оператору… ⏳", "eva"), 500);
    sendToTelegram();
    step = 3;
  }
}

function sendToTelegram() {
  const msg = `
🔥 НОВА ЗАЯВКА З САЙТУ
👤 Ім'я: ${userData.name}
📌 Тип страховки: ${userData.type}
📞 Телефон: ${userData.phone}
  `;

  fetch("/api/sendTelegram", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ message: msg })
  })
  .then(res => res.json())
  .then(data => console.log("Telegram response:", data))
  .catch(err => console.error("Telegram error:", err));
}
</script>
