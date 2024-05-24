import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [unverified, setUnverified] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/login', {
        email,
        password,
      });
      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        setError('');
        setUnverified(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 401 && error.response.data === 'Email not verified') {
        setUnverified(true);
        setError('');
      } else {
        setError('Invalid email or password');
        setUnverified(false);
      }
    }
  };

  const handleClick = () => {
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
    
  };


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <form onSubmit={handleSubmit} style={{ width: '300px' }}>
        <h2>Login</h2>
        <br></br><br></br>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {unverified && <p style={{ color: 'orange' }}>Your email is not verified. <Link to="/verify-email">Resend Verification Email</Link></p>}
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
        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button  onClick={handleClick} type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none' }}>
          Login
        </button>
        <br></br><br></br>
        <p><a href="/register" style={{ color: '#007BFF', textDecoration: 'none' }}>Registeren?</a></p>
      </form>
    </div>
  );
};

export default Login;
