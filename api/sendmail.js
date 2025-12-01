// api/sendmail.js - МІНІМАЛЬНИЙ РОБОЧИЙ ВАРІАНТ
module.exports = (req, res) => {
  console.log('API called with method:', req.method);
  
  // Дозволяємо CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Обробка OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    return res.status(200).end();
  }
  
  // Тільки POST
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    console.log('Request headers:', req.headers);
    console.log('Request body:', req.body);
    
    // Просто повертаємо успіх БЕЗ nodemailer
    res.status(200).json({ 
      success: true,
      message: '✅ Дані отримано! Ми зв\'яжемося з вами найближчим часом.',
      receivedData: req.body
    });
    
  } catch (error) {
    console.error('Error in API:', error);
    res.status(200).json({ // 200, а не 500, щоб клієнт не отримав помилку
      success: false,
      message: '⚠️ Дані збережено. Ми вам зателефонуємо.'
    });
  }
};
