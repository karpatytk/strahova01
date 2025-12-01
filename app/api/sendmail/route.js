import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, type, phone } = body;

    if (!name || !type || !phone) {
      return new Response(JSON.stringify({ error: "Не всі поля заповнені" }), { status: 400 });
    }

    const EMAIL_USER = process.env.EMAIL_USER;
    const EMAIL_PASS = process.env.EMAIL_PASS;
    const EMAIL_TO = process.env.EMAIL_TO;

    if (!EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
      return new Response(JSON.stringify({ error: "Немає налаштувань email" }), { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: EMAIL_USER,
      to: EMAIL_TO,
      subject: "Нова заявка зі сайту Страхування 360",
      text: `
Ім'я: ${name}
Тип страховки: ${type}
Телефон: ${phone}
      `,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Помилка", details: error.message }), { status: 500 });
  }
}
