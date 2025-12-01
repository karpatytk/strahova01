// api/sendmail.js - ПОВНА ВЕРСІЯ
module.exports = async (req, res) => {
  console.log(`📞 ${req.method} запит до API ${new Date().toISOString()}`);

  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // OPTIONS
  if (req.method === 'OPTIONS') {
    console.log('🔄 OPTIONS запит');
    return res.status(200).end();
  }

  // GET - тест API
  if (req.method === 'GET') {
    console.log('🔍 GET тест API');
    
    // Перевіряємо налаштування
    const hasToken = !!process.env.TELEGRAM_BOT_TOKEN;
    const hasChatId = !!process.env.TELEGRAM_CHAT_ID;
    
    console.log('Telegram налаштування:', {
      hasToken,
      hasChatId,
      chatId: process.env.TELEGRAM_CHAT_ID || 'не встановлено'
    });
    
    return res.json({
      success: true,
      message: hasToken && hasChatId 
        ? '✅ API працює! Telegram готовий.' 
        : '⚠️ API працює, але Telegram не налаштовано',
      telegramConfigured: hasToken && hasChatId,
      telegramToken: hasToken ? 'Встановлено' : 'Не встановлено',
      telegramChatId: process.env.TELEGRAM_CHAT_ID || 'Не встановлено',
      timestamp: new Date().toISOString()
    });
  }

  // POST - обробка заявки
  if (req.method === 'POST') {
    console.log('📮 POST заявка');
    
    try {
      // Зчитуємо дані
      let body = '';
      for await (const chunk of req) {
        body += chunk.toString();
      }
      
      console.log('📦 Body отримано:', body.length, 'символів');
      
      const data = JSON.parse(body || '{}');
      console.log('👤 Дані користувача:', data);

      // TELEGRAM
      const telegramToken = process.env.TELEGRAM_BOT_TOKEN;
      const telegramChatId = process.env.TELEGRAM_CHAT_ID;
      
      console.log('🤖 Telegram налаштування для POST:', {
        hasToken: !!telegramToken,
        hasChatId: !!telegramChatId,
        chatId: telegramChatId
      });
      
      if (telegramToken && telegramChatId) {
        console.log('🔄 Відправляю в Telegram...');
        try {
          const message = `📋 НОВА ЗАЯВКА З САЙТУ\n\n👤 Ім'я: ${data.name || 'Не вказано'}\n📞 Телефон: ${data.phone || 'Не вказано'}\n🏷 Тип: ${data.type || 'Не вказано'}\n⏰ Час: ${new Date().toLocaleString('uk-UA')}\n🌐 Сайт: strahova.biz.ua`;
          
          const telegramUrl = `https://api.telegram.org/bot${telegramToken}/sendMessage`;
          console.log('🔗 Telegram URL (приховано):', telegramUrl.replace(telegramToken, 'TOKEN_HIDDEN'));
          
          const telegramResponse = await fetch(telegramUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              chat_id: telegramChatId,
              text: message
            })
          });
          
          const telegramResult = await telegramResponse.json();
          console.log('📊 Відповідь Telegram:', telegramResult.ok ? '✅ Успішно' : `❌ Помилка: ${telegramResult.description}`);
          
        } catch (telegramError) {
          console.error('❌ Помилка Telegram:', telegramError.message);
        }
      } else {
        console.error('⚠️ Telegram не налаштовано! Дані не відправлені в Telegram.');
      }

      // Відповідь користувачу
      const response = {
        success: true,
        message: `✅ Дякуємо, ${data.name || ''}! Ми вам зателефонуємо протягом 15 хвилин.`,
        telegramAttempted: !!(telegramToken && telegramChatId),
        timestamp: new Date().toISOString()
      };
      
      console.log('📤 Відповідь користувачу:', response);
      res.json(response);

    } catch (error) {
      console.error('💥 Критична помилка:', error.message);
      console.error('💥 Stack:', error.stack);
      
      res.json({
        success: true,
        message: '✅ Дякуємо за заявку! Ми з вами зв\'яжемось.'
      });
    }
  }
  
  // Якщо метод не GET, POST або OPTIONS
  res.status(405).json({ 
    success: false, 
    error: 'Method not allowed' 
  });
};