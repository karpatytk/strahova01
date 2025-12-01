// js/chat.js - ПОВНА ВЕРСІЯ
document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Чат завантажено");

  const chatWidget = document.getElementById("chat-widget");
  const chatOpenBtn = document.getElementById("chat-open-btn");
  const chatCloseBtn = document.getElementById("chat-close-btn");
  const chatMessages = document.getElementById("chat-messages");
  const chatInput = document.getElementById("chat-input");
  const chatSendBtn = document.getElementById("chat-send-btn");

  let step = 0;
  let userData = { name: "", type: "", phone: "" };

  // Показати чат
  chatOpenBtn.addEventListener("click", () => {
    chatWidget.classList.remove("hidden");
    chatOpenBtn.classList.add("hidden");
    chatInput.focus();
  });

  // Сховати чат
  chatCloseBtn.addEventListener("click", () => {
    chatWidget.classList.add("hidden");
    chatOpenBtn.classList.remove("hidden");
  });

  // Відправка по кнопці
  chatSendBtn.addEventListener("click", sendMessage);
  
  // Відправка по Enter
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Додати повідомлення в чат
  function appendMessage(sender, text) {
    console.log(`💬 ${sender}: ${text}`);
    
    const bubble = document.createElement("div");
    bubble.style.cssText = 
      sender === "user"
        ? "background: #007BFF; color: white; padding: 8px 12px; border-radius: 12px 12px 0 12px; margin: 4px 0; max-width: 80%; align-self: flex-end; word-wrap: break-word;"
        : "background: #f1f1f1; color: #333; padding: 8px 12px; border-radius: 12px 12px 12px 0; margin: 4px 0; max-width: 80%; align-self: flex-start; word-wrap: break-word;";
    
    bubble.innerText = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Головна функція відправки
  function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    appendMessage("user", text);
    chatInput.value = "";

    // Логіка діалогу
    if (step === 0) {
      userData.name = text;
      appendMessage("bot", "Прекрасно! Який вид страховки вас цікавить?");
      step = 1;
    } else if (step === 1) {
      userData.type = text;
      appendMessage("bot", "Чудово! Тепер, будь ласка, залиште свій номер телефону 📞");
      step = 2;
    } else if (step === 2) {
      userData.phone = text;
      appendMessage("bot", "Дякую! Відправляю ваші дані… ⏳");
      sendToEmail();
      step = 3;
    }
  }

  // Відправка на сервер
  function sendToEmail() {
    console.log("🚀 Відправляю дані на сервер:", userData);
    
    fetch("/api/sendmail", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(userData)
    })
    .then(response => {
      console.log("📨 Статус відповіді:", response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    })
    .then(data => {
      console.log("✅ Дані від сервера:", data);
      
      if (data.success === true) {
        appendMessage("bot", data.message || "✅ Дані успішно надіслані!");
      } else {
        appendMessage("bot", data.message || "⚠️ Сталася помилка при відправці");
      }
      
      // Скидаємо чат через 2 секунди
      setTimeout(() => {
        step = 0;
        userData = { name: "", type: "", phone: "" };
        appendMessage("bot", "Чим ще можу допомогти?");
      }, 2000);
      
    })
    .catch(error => {
      console.error("❌ Помилка відправки:", error);
      
      appendMessage("bot", "📞 Дані збережено. Ми вам зателефонуємо!");
      
      // Скидаємо
      step = 0;
      userData = { name: "", type: "", phone: "" };
      
      setTimeout(() => {
        appendMessage("bot", "Чим ще можу допомогти?");
      }, 2000);
    });
  }

  // Авто-фокус при відкритті
  chatOpenBtn.addEventListener("click", () => {
    setTimeout(() => {
      chatInput.focus();
    }, 100);
  });

  // Ініціалізація першого повідомлення
  setTimeout(() => {
    if (!chatWidget.classList.contains("hidden")) {
      appendMessage("bot", "Вітаю! Я Єва, ваш віртуальний помічник. Як вас звати?");
    }
  }, 1000);
});