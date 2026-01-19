// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.BCRYPT_ROUNDS = '4'; // Use fewer rounds for faster tests
