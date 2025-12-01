// api/sendmail.js - ФІНАЛЬНА ВЕРСІЯ
const axios = require('axios');

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    return res.json({ 
      success: true, 
      message: 'API працює. Telegram бот активовано.'
    });
  }

  if (req.method === 'POST') {
    try {
      // Зчитуємо body
      let body = '';
      for await (const chunk of req) {
        body += chunk;
      }
      
      if (!body) {
        throw new Error('No data received');
      }
      
      const data = JSON.parse(body);
      console.log('📥 Отримано заявку:', data);

      // Telegram налаштування
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      
      // Формуємо повідомлення
      const message = `📋 *НОВА ЗАЯВКА З САЙТУ*

👤 *Ім'я:* ${data.name || 'Не вказано'}
🏷 *Тип страхування:* ${data.type || 'Не вказано'}
📱 *Телефон:* ${data.phone || 'Не вказано'}
⏰ *Час:* ${new Date().toLocaleString('uk-UA')}
🌐 *Сайт:* strahova.biz.ua

_Заявку отримано автоматично_`;

      // Відправляємо в Telegram
      if (telegramToken && telegramChatId) {
        try {
          const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
          
          await axios.post(telegramUrl, {
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'Markdown',
            disable_notification: false
          });
          
          console.log('✅ Повідомлення відправлено в Telegram');
        } catch (telegramError) {
          console.error('❌ Помилка Telegram:', telegramError.message);
          // Продовжуємо роботу навіть при помилці Telegram
        }
      } else {
        console.log('ℹ️ Telegram не налаштовано, але заявку отримано:', data);
      }

      // Відповідь користувачу на сайті
      res.status(200).json({
        success: true,
        message: '✅ Дякуємо! Ваші дані отримано. Ми вам зателефонуємо протягом 15 хвилин.'
      });

    } catch (error) {
      console.error('❌ Помилка обробки запиту:', error.message);
      
      // Все одно повертаємо успіх для користувача
      res.status(200).json({
        success: true,
        message: '✅ Дякуємо! Ми з вами зв\'яжемось найближчим часом.'
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};