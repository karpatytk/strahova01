// api/sendmail.js - НАЙПРОСТІША ВЕРСІЯ
module.exports = (req, res) => {
  console.log('✅ API викликано');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // OPTIONS запит
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Відповідь
  res.status(200).json({
    success: true,
    message: '✅ API працює! Telegram готовий.',
    timestamp: new Date().toISOString()
  });
};