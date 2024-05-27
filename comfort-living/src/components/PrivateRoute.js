import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const [userStatus, setUserStatus] = useState({ isVerified: null, isBlocked: null });

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          console.log('Token expired');
          localStorage.removeItem('token');
          setUserStatus({ isVerified: false, isBlocked: false });
        } else {
          axios.get('http://localhost:3001/check-verification', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then(response => {
            setUserStatus({
              isVerified: response.data.isVerified,
              isBlocked: response.data.isBlocked,
            });
          })
          .catch(error => {
            console.error('Error during verification check:', error);
            setUserStatus({ isVerified: false, isBlocked: false });
          });
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setUserStatus({ isVerified: false, isBlocked: false });
      }
    } else {
      setUserStatus({ isVerified: false, isBlocked: false });
    }
  }, [token]);

  if (userStatus.isVerified === null || userStatus.isBlocked === null) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (userStatus.isBlocked) {
    return <Navigate to="/blocked" />;
  }

  if (!userStatus.isVerified) {
    return <Navigate to="/verify-email" />;
  }

  return children;
};

export default PrivateRoute;
