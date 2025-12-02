// js/chat.js - ОНОВЛЕНА ВЕРСІЯ ДЛЯ МОБІЛЬНИХ
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

  // Функція для мобільного скролу
  function scrollChatToBottom() {
    setTimeout(() => {
      chatMessages.scrollTop = chatMessages.scrollHeight;
      // Для мобільних - додатковий скрол
      if (window.innerWidth <= 768) {
        chatWidget.scrollTop = chatWidget.scrollHeight;
      }
    }, 100);
  }

  // Показати чат
  chatOpenBtn.addEventListener("click", () => {
    chatWidget.classList.remove("hidden");
    chatOpenBtn.classList.add("hidden");
    chatInput.focus();
    scrollChatToBottom();
    
    // На мобільних - фікс позиції
    if (window.innerWidth <= 768) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        chatWidget.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  });

  // Сховати чат
  chatCloseBtn.addEventListener("click", () => {
    chatWidget.classList.add("hidden");
    chatOpenBtn.classList.remove("hidden");
    if (window.innerWidth <= 768) {
      document.body.style.overflow = 'auto';
    }
  });

  // Відправка
  chatSendBtn.addEventListener("click", sendMessage);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // Додати повідомлення
  function appendMessage(sender, text) {
    const bubble = document.createElement("div");
    
    // Стилі для мобільних та десктоп
    if (sender === "user") {
      bubble.style.cssText = window.innerWidth <= 768 
        ? "background: #007BFF; color: white; padding: 10px 14px; border-radius: 18px 18px 4px 18px; margin: 8px 0; max-width: 85%; align-self: flex-end; word-wrap: break-word; font-size: 14px;"
        : "background: #007BFF; color: white; padding: 8px 12px; border-radius: 12px 12px 0 12px; margin: 4px 0; max-width: 80%; align-self: flex-end; word-wrap: break-word;";
    } else {
      bubble.style.cssText = window.innerWidth <= 768
        ? "background: #f1f1f1; color: #333; padding: 10px 14px; border-radius: 18px 18px 18px 4px; margin: 8px 0; max-width: 85%; align-self: flex-start; word-wrap: break-word; font-size: 14px;"
        : "background: #f1f1f1; color: #333; padding: 8px 12px; border-radius: 12px 12px 12px 0; margin: 4px 0; max-width: 80%; align-self: flex-start; word-wrap: break-word;";
    }
    
    bubble.innerText = text;
    chatMessages.appendChild(bubble);
    scrollChatToBottom();
  }

  // Відправка повідомлення
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
    fetch("/api/sendmail", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(userData)
    })
    .then(response => response.json())
    .then(data => {
      if (data.success === true) {
        appendMessage("bot", data.message || "✅ Дані успішно надіслані!");
      } else {
        appendMessage("bot", data.message || "⚠️ Сталася помилка");
      }
      
      // Скидаємо чат
      setTimeout(() => {
        step = 0;
        userData = { name: "", type: "", phone: "" };
        appendMessage("bot", "Чим ще можу допомогти?");
      }, 2000);
      
    })
    .catch(error => {
      console.error("Помилка:", error);
      appendMessage("bot", "📞 Дані збережено. Ми вам зателефонуємо!");
      
      // Скидаємо
      step = 0;
      userData = { name: "", type: "", phone: "" };
      
      setTimeout(() => {
        appendMessage("bot", "Чим ще можу допомогти?");
      }, 2000);
    });
  }

  // Фікс для iOS клавіатури
  if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
    chatInput.addEventListener('focus', () => {
      setTimeout(() => {
        document.activeElement.scrollIntoViewIfNeeded();
      }, 300);
    });
  }
});