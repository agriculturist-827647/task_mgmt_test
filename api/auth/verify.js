const { authenticate } = require('../lib/auth');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  const auth = authenticate(req);
  if (auth.error) {
    return res.status(auth.error.status).json({
      success: false,
      error: { message: auth.error.message }
    });
  }

  res.json({
    success: true,
    data: {
      user: { id: auth.userId, email: auth.user.email }
    },
    message: 'Token is valid'
  });
};
