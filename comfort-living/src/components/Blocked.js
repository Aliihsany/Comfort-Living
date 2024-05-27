import React from 'react';
import { useNavigate } from 'react-router-dom';

const Blocked = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div>
      <h1>Your account is blocked</h1>
      <p>Please contact support for more information.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Blocked;
