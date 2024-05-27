import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Houselist.css';

const Houselist = () => {
  const [houses, setHouses] = useState([]);

  useEffect(() => {
    const fetchHouses = async () => {
      try {
        const response = await axios.get('http://localhost:3001/panden');
        setHouses(response.data);
      } catch (error) {
        console.error('Error fetching houses:', error);
      }
    };

    fetchHouses();
  }, []);

  return (
    <div className="house-list-container">
      <div className="house-list">
        <h1>Houses for Rent</h1>
        <ul>
          {houses.map((house) => (
            <li key={house.id} className="house-item">
              <Link to={`/house/${house.id}`}>
                <img src={house.image} alt={house.naam} className="house-image" />
                <p>ID: {house.id}</p>
                <p>{house.naam} - {house.locatie}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Houselist;