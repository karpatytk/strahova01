document.addEventListener("DOMContentLoaded", function () {
    const chatWidget = document.getElementById("chat-widget");
    const chatOpenBtn = document.getElementById("chat-open-btn");
    const chatCloseBtn = document.getElementById("chat-close-btn");
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const chatSendBtn = document.getElementById("chat-send-btn");

    let step = 0;
    let userData = { name: "", type: "", phone: "" };

    // Відкриття/закриття чату
    chatOpenBtn.addEventListener("click", () => {
        chatWidget.classList.remove("hidden");
        chatOpenBtn.classList.add("hidden");
    });
    chatCloseBtn.addEventListener("click", () => {
        chatWidget.classList.add("hidden");
        chatOpenBtn.classList.remove("hidden");
    });

    // Відправка повідомлення
    chatSendBtn.addEventListener("click", sendMessage);
    chatInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") sendMessage();
    });

    function appendMessage(sender, text) {
        const bubble = document.createElement("div");
        bubble.className =
            sender === "user"
                ? "bg-blue-500 text-white p-2 rounded-lg mb-2 self-end max-w-[80%]"
                : "bg-gray-200 p-2 rounded-lg mb-2 self-start max-w-[80%]";
        bubble.innerText = text;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage("user", text);
        chatInput.value = "";

        setTimeout(() => handleBotLogic(text), 300);
    }

    function handleBotLogic(text) {
        if (step === 0) {
            userData.name = text;
            appendMessage("bot", `Приємно познайомитись, ${text}! 😊\nЯкий вид страховки вас цікавить?`);
            step = 1;
            return;
        }

        if (step === 1) {
            userData.type = text;
            appendMessage("bot", "Добре! Тепер залиште свій номер телефону 📞");
            step = 2;
            return;
        }

        if (step === 2) {
            userData.phone = text;
            appendMessage("bot", "Дякую! Відправляю ваші дані оператору ⏳");
            sendToTelegram();
            step = 3;
            return;
        }
    }

    function sendToTelegram() {
        fetch("/api/sendTelegram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: userData.name,
                type: userData.type,
                phone: userData.phone
            })
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                appendMessage("bot", "Ваші дані успішно відправлено! ✅");
            } else {
                appendMessage("bot", "Сталася помилка при відправці 😢");
                console.error("Telegram error:", data);
            }
        })
        .catch(err => {
            appendMessage("bot", "Сталася помилка при відправці 😢");
            console.error("Telegram error:", err);
        });
    }
});
