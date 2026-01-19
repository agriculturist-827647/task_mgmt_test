const { store, verifyPassword, createToken } = require('../lib/store');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required' }
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let foundUser = null;
    let foundUserId = null;

    for (const [id, user] of store.users) {
      if (user.email === normalizedEmail) {
        foundUser = user;
        foundUserId = id;
        break;
      }
    }

    if (!foundUser || !verifyPassword(password, foundUser.password)) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid email or password' }
      });
    }

    const token = createToken(foundUserId);

    res.json({
      success: true,
      data: {
        token,
        user: { id: foundUserId, email: foundUser.email }
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Login failed' }
    });
  }
};
