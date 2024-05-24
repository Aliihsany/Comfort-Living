import React, { useState } from 'react';
import axios from 'axios';
import log from 'loglevel';

// Configure loglevel
if (process.env.NODE_ENV === 'production') {
  log.setLevel('warn');
} else {
  log.setLevel('debug');
}

const VerifyEmail = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/resend-verification', { email });
      if (response.status === 200) {
        setMessage('Verification email sent. Please check your inbox.');
        setError('');
      } else {
        setMessage('');
        setError('Failed to send verification email. Please try again later.');
      }
    } catch (error) {
      log.error('Error sending verification email:', error);
      if (error.response) {
        setError(`Error: ${error.response.data}`);
      } else {
        setError('Error sending verification email. Please check your email and try again.');
      }
      setMessage('');
    }
  };

  log.debug('VerifyEmail component rendered');

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ width: '300px' }}>
        <h2>Resend Verification Email</h2>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none' }}>
          Resend Verification Email
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
