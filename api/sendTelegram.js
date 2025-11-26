// api/sendTelegram.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не дозволено" });
  }

  const { name, type, phone } = req.body;

  if (!name || !type || !phone) {
    return res.status(400).json({ error: "Не всі дані заповнені" });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    return res.status(500).json({ error: "Помилка конфігурації Telegram" });
  }

  const msg = `
🔥 НОВА ЗАЯВКА З САЙТУ
👤 Ім'я: ${name}
📌 Тип страховки: ${type}
📞 Телефон: ${phone}
  `;

  try {
    const tgResponse = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: CHAT_ID, text: msg }),
      }
    );

    const data = await tgResponse.json();
    if (!data.ok) {
      throw new Error(JSON.stringify(data));
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("TELEGRAM ERROR:", err);
    return res.status(500).json({
      success: false,
      error: "Помилка при відправці в Telegram",
      details: err.message,
    });
  }
}

