// api/sendmail.js - ПРАЦЮЮЧА ВЕРСІЯ З TELEGRAM
const axios = require('axios');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET тест
  if (req.method === 'GET') {
    return res.json({ 
      success: true, 
      message: '✅ API працює. Telegram бот на зв\'язку.',
      chatId: process.env.TELEGRAM_CHAT_ID ? 'налаштовано' : 'не налаштовано'
    });
  }

  // POST запит
  if (req.method === 'POST') {
    try {
      // Зчитуємо body
      let body = '';
      for await (const chunk of req) {
        body += chunk.toString();
      }
      
      const data = JSON.parse(body || '{}');
      console.log('📥 Нова заявка:', data);

      // Telegram повідомлення
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      
      if (telegramToken && telegramChatId) {
        try {
          const message = `📋 *НОВА ЗАЯВКА З САЙТУ*

👤 *Ім'я:* ${data.name || 'Не вказано'}
🏷 *Тип страхування:* ${data.type || 'Не вказано'}
📱 *Телефон:* \`${data.phone || 'Не вказано'}\`
⏰ *Час:* ${new Date().toLocaleString('uk-UA')}
🌐 *Сайт:* strahova.biz.ua

_Заявку отримано автоматично_`;

          await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            chat_id: telegramChatId,
            text: message,
            parse_mode: 'Markdown'
          });
          
          console.log('✅ Telegram: повідомлення відправлено');
        } catch (telegramError) {
          console.error('❌ Telegram помилка:', telegramError.message);
          // Продовжуємо роботу
        }
      } else {
        console.log('⚠️ Telegram не налаштовано, але заявку отримано');
      }

      // Відповідь користувачу
      res.status(200).json({
        success: true,
        message: '✅ Дякуємо! Ваші дані отримано. Ми вам зателефонуємо протягом 15 хвилин.'
      });

    } catch (error) {
      console.error('❌ Помилка:', error.message);
      
      // Все одно успіх для користувача
      res.status(200).json({
        success: true,
        message: '✅ Дякуємо! Ми з вами зв\'яжемось найближчим часом.'
      });
    }
  }
};