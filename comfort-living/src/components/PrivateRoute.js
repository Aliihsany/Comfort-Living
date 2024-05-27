import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          setIsVerified(false);
        } else {
          axios.get('http://localhost:3001/check-verification', {
            headers: {
              Authorization: token,
            },
          })
          .then(response => {
            setIsVerified(response.data.isVerified);
          })
          .catch(() => {
            setIsVerified(false);
          });
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setIsVerified(false);
      }
    } else {
      setIsVerified(false);
    }
  }, [token]);

  if (isVerified === null) {
    return <div>Loading...</div>;
  }

  // if (!token) {
  //   return <Navigate to="/login" />;
  // }

  // if (!isVerified) {
  //   return <Navigate to="/verify-email" />;
  // }

  return children;
};

export default PrivateRoute;
