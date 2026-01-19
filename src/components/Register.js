import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');
  const { register, error, clearError } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!email || !password) {
      setLocalError('Please fill in all fields');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const result = await register(email, password);
    setIsLoading(false);
    if (!result.success) setLocalError(result.error);
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <h2>Create Account</h2>
      {(localError || error) && <div className="error-message">{localError || error}</div>}
      <div className="form-group">
        <label htmlFor="register-email">Email</label>
        <input id="register-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" disabled={isLoading} />
      </div>
      <div className="form-group">
        <label htmlFor="register-password">Password</label>
        <input id="register-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" disabled={isLoading} />
      </div>
      <div className="form-group">
        <label htmlFor="register-confirm">Confirm Password</label>
        <input id="register-confirm" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your password" disabled={isLoading} />
      </div>
      <button type="submit" className="btn btn-primary" disabled={isLoading}>
        {isLoading ? 'Creating Account...' : 'Register'}
      </button>
    </form>
  );
}

export default Register;
