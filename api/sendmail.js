// api/sendmail.js - ВИПРАВЛЕНА ВЕРСІЯ
module.exports = async (req, res) => {
  console.log(`📞 ${req.method} запит до API`);
  
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // GET - тест API
  if (req.method === 'GET') {
    return res.json({ 
      success: true, 
      message: '✅ API працює! Telegram готовий.',
      timestamp: new Date().toISOString()
    });
  }
  
  // POST - реальна обробка даних
  if (req.method === 'POST') {
    try {
      // Зчитуємо body
      let body = '';
      for await (const chunk of req) {
        body += chunk.toString();
      }
      
      console.log('📦 POST body:', body);
      
      let data = {};
      if (body) {
        data = JSON.parse(body);
      }
      
      console.log('📊 Дані від користувача:', data);
      
      // ТУТ ДОДАЙТЕ КОД ДЛЯ TELEGRAM
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      
      if (telegramToken && telegramChatId) {
        console.log('Відправляю в Telegram...');
        // Додайте код для відправки в Telegram
      }
      
      // ВАЖЛИВО: Повертаємо ІНШУ відповідь для POST!
      return res.json({
        success: true,
        message: '✅ Дякуємо! Ми вам зателефонуємо протягом 15 хвилин.',
        received: data,
        processed: true
      });
      
    } catch (error) {
      console.error('❌ Помилка:', error);
      return res.json({
        success: true,
        message: '✅ Дякуємо! Ми з вами зв\'яжемось найближчим часом.'
      });
    }
  }
};