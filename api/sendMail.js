import nodemailer from "nodemailer";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Метод не дозволено" });
  }

  const { name, type, phone } = req.body;

  if (!name || !type || !phone) {
    return res.status(400).json({ error: "Не всі дані заповнені" });
  }

  // Дані з Environment Variables
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  const EMAIL_TO = process.env.EMAIL_TO;

  if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
    return res.status(500).json({ error: "Помилка конфігурації пошти" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail", // або інший SMTP сервіс
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: EMAIL_USER,
      to: EMAIL_TO,
      subject: "Нова заявка з сайту Страхування 360",
      text: `
Нова заявка з сайту:
Ім'я: ${name}
Тип страховки: ${type}
Телефон: ${phone}
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("EMAIL ERROR:", err);
    return res.status(500).json({ error: "Помилка при відправці email", details: err.message });
  }
}
