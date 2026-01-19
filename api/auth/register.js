const { store, hashPassword, createToken, generateId } = require('../lib/store');

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: { message: 'Method not allowed' } });
  }

  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required' }
      });
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        success: false,
        error: { message: 'Invalid email format' }
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: { message: 'Password must be at least 8 characters' }
      });
    }

    // Check if user exists
    const normalizedEmail = email.toLowerCase().trim();
    for (const [, user] of store.users) {
      if (user.email === normalizedEmail) {
        return res.status(409).json({
          success: false,
          error: { message: 'User with this email already exists' }
        });
      }
    }

    // Create user
    const userId = generateId();
    const user = {
      id: userId,
      email: normalizedEmail,
      password: hashPassword(password),
      createdAt: new Date().toISOString()
    };
    store.users.set(userId, user);

    // Generate token
    const token = createToken(userId);

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: userId, email: normalizedEmail, createdAt: user.createdAt }
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({
      success: false,
      error: { message: 'Registration failed' }
    });
  }
};
