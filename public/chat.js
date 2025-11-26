document.addEventListener("DOMContentLoaded", function () {
    const chatWidget = document.getElementById("chat-widget");
    const chatOpenBtn = document.getElementById("chat-open-btn");
    const chatCloseBtn = document.getElementById("chat-close-btn");
    const chatMessages = document.getElementById("chat-messages");
    const chatInput = document.getElementById("chat-input");
    const chatSendBtn = document.getElementById("chat-send-btn");

    // Включення/виключення чату
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

    function sendMessage() {
        const text = chatInput.value.trim();
        if (!text) return;

        appendMessage("user", text);
        chatInput.value = "";

        setTimeout(() => {
            handleBotLogic(text);
        }, 600);
    }

    function appendMessage(sender, text) {
        let bubble = document.createElement("div");
        bubble.className =
            sender === "user"
                ? "bg-blue-500 text-white p-2 rounded-lg mb-2 self-end max-w-[80%]"
                : "bg-gray-200 p-2 rounded-lg mb-2 self-start max-w-[80%]";
        bubble.innerText = text;
        chatMessages.appendChild(bubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Основна логіка робота Єви
    function handleBotLogic(text) {
        const lower = text.toLowerCase();

        if (lower.includes("привіт") || lower.includes("добр")) {
            appendMessage("bot", "Привіт! Я Єва 😊 Чим можу допомогти?");
            return;
        }

        if (lower.includes("авто") || lower.includes("цив")) {
            appendMessage("bot", "Хочете оформити Автоцивілку? Напишіть номер авто та рік випуску 🚗");
            return;
        }

        if (lower.includes("зел") && lower.includes("кар")) {
            appendMessage("bot", "Потрібна Зелена карта? Напишіть країну виїзду та дати 😌");
            return;
        }

        appendMessage("bot", "Дякую! Я передам повідомлення оператору. Зараз опрацюю…");

        // Відправка на сервер Vercel API
        fetch("/api/sendTelegram", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text })
        })
        .then(res => res.json())
        .then(data => console.log("Telegram API response:", data))
        .catch(err => console.error("Telegram API error:", err));
    }
});
