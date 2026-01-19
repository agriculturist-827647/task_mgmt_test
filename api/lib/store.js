// Simple in-memory store (for demo purposes)
// In production, use a database like MongoDB Atlas, Supabase, or PlanetScale

const crypto = require('crypto');

// Store data (resets on cold start in serverless)
const store = {
  users: new Map(),
  tasks: new Map()
};

// Simple password hashing
function hashPassword(password) {
  return crypto.createHash('sha256').update(password + 'salt_key').digest('hex');
}

function verifyPassword(password, hash) {
  return hashPassword(password) === hash;
}

// JWT-like token (simplified)
const SECRET = process.env.JWT_SECRET || 'demo-secret-key-change-in-production';

function createToken(userId) {
  const payload = JSON.stringify({ userId, exp: Date.now() + 24 * 60 * 60 * 1000 });
  const signature = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
  return Buffer.from(payload).toString('base64') + '.' + signature;
}

function verifyToken(token) {
  try {
    const [payloadB64, signature] = token.split('.');
    const payload = Buffer.from(payloadB64, 'base64').toString();
    const expectedSig = crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
    if (signature !== expectedSig) return null;
    const data = JSON.parse(payload);
    if (data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

module.exports = { store, hashPassword, verifyPassword, createToken, verifyToken, generateId };
