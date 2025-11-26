// api/sendTelegram.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Метод не дозволено" });
    return;
  }

  const { name, type, phone } = req.body;

  if (!name || !type || !phone) {
    res.status(400).json({ error: "Не всі дані заповнені" });
    return;
  }

  const BOT_TOKEN = "8324518762:AAG-4dhvR8hxJI9UBVgFetpAKN4Em1ooW2o";
  const CHAT_ID = "486990958";

  const msg = `
🔥 НОВА ЗАЯВКА З САЙТУ
👤 Ім'я: ${name}
📌 Тип страховки: ${type}
📞 Телефон: ${phone}
  `;

  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text: msg })
    });

    const data = await response.json();
    if (!data.ok) throw new Error(JSON.stringify(data));

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Помилка при відправці в Telegram" });
  }
}
