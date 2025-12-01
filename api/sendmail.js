// api/sendmail.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  // Дозволяємо CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обробляємо OPTIONS запит для CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Тільки POST запити
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, type, phone } = req.body;

    // Налаштування транспортера (замініть на ваші дані)
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'ваш-email@gmail.com',
      subject: 'Нова заявка з сайту Страхування 360',
      text: `Ім'я: ${name}\nТип страхування: ${type}\nТелефон: ${phone}`,
      html: `<h3>Нова заявка</h3><p><strong>Ім'я:</strong> ${name}</p><p><strong>Тип страхування:</strong> ${type}</p><p><strong>Телефон:</strong> ${phone}</p>`,
    };

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, error: error.message });
  }
};
}
