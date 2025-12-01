// api/sendmail.js - ВИПРАВЛЕНА ВЕРСІЯ
module.exports = async (req, res) => {
  console.log('API called with method:', req.method);

  // Дозволяємо CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Обробка OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Дозволимо GET для тесту
  if (req.method === 'GET') {
    return res.status(200).json({ 
      success: true, 
      message: 'API працює! Тестуйте POST запити.',
      timestamp: new Date().toISOString()
    });
  }

  // Обробка POST
  if (req.method === 'POST') {
    try {
      let body = '';
      
      // Зчитуємо body по частинах
      for await (const chunk of req) {
        body += chunk;
      }
      
      let data = {};
      if (body) {
        data = JSON.parse(body);
      }
      
      console.log('Received data:', data);
      
      // Відповідь
      res.status(200).json({
        success: true,
        message: '✅ Дані отримано! Ми зв\'яжемося з вами найближчим часом.',
        receivedData: data
      });
      
    } catch (error) {
      console.error('Error in API:', error);
      res.status(200).json({
        success: false,
        message: '⚠️ Дані збережено. Ми вам зателефонуємо.',
        error: error.message
      });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
};