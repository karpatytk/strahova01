// /api/sendMail.js

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, phone, message } = req.body;

    // Перевірка даних
    if (!name || !phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Тут буде реальна відправка email (SMTP, SendGrid або Resend)
    // Поки просто заглушка — щоб сайт працював без помилок
    console.log("📩 Нове повідомлення:");
    console.log("Ім’я:", name);
    console.log("Телефон:", phone);
    console.log("Повідомлення:", message);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Помилка sendmail:", error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
