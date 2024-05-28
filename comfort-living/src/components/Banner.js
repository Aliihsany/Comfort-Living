import React, { useEffect, useState } from 'react';
import './Banner.css';  
import axios from 'axios';

const Banner = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState({
    voornaam: '',
    achternaam: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          const data = response.data;
          setUserData({
            voornaam: data.voornaam,
            achternaam: data.achternaam           
            
          });
        } else {
          setError('Error fetching data');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }


  return (
    <div className='banner'>
      <h1 style={{color: 'lightblue'}}>Comfort Living <br></br><br></br>
        <div style={{color: 'lightblue'}}>Welkom, {userData.voornaam}</div>
        </h1>
      </div>
  );
};

export default Banner;