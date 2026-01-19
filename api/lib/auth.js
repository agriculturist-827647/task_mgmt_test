const { verifyToken, store } = require('./store');

function authenticate(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: { status: 401, message: 'No token provided' } };
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return { error: { status: 401, message: 'Invalid or expired token' } };
  }

  const user = store.users.get(decoded.userId);
  if (!user) {
    return { error: { status: 401, message: 'User not found' } };
  }

  return { user, userId: decoded.userId };
}

module.exports = { authenticate };
