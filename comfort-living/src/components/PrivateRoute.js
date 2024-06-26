import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

const PrivateRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const [userStatus, setUserStatus] = useState({ isVerified: null, isBlocked: null, role: null });

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        console.log('Decoded Token:', decodedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          console.log('Token expired');
          localStorage.removeItem('token');
          setUserStatus({ isVerified: false, isBlocked: false, role: null });
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
              role: decodedToken.role 
            });
          })
          .catch(error => {
            console.error('Error during verification check:', error);
            setUserStatus({ isVerified: false, isBlocked: false, role: null });
          });
        }
      } catch (error) {
        console.error('Invalid token:', error);
        localStorage.removeItem('token');
        setUserStatus({ isVerified: false, isBlocked: false, role: null });
      }
    } else {
      setUserStatus({ isVerified: false, isBlocked: false, role: null });
    }
  }, [token]);

  if (userStatus.isVerified === null || userStatus.isBlocked === null || userStatus.role === null) {
    return <div>Laden...</div>;
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

  if (requiredRole && userStatus.role !== requiredRole) {
    console.log('User role does not match required role:', userStatus.role); 
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default PrivateRoute;
