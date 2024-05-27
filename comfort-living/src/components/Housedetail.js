import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Housedetail.css';

const Housedetail = () => {
  const { id } = useParams();
  const [house, setHouse] = useState(null);

  useEffect(() => {
    const fetchHouse = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/panden/${id}`);
        setHouse(response.data);
      } catch (error) {
        console.error('Error fetching house:', error);
      }
    };

    fetchHouse();
  }, [id]);

  if (!house) {
    return <h2>House not found</h2>;
  }

  return (
    <div className="house-detail">
      <h1>{house.naam}</h1>
      <p>Kamerindeling: {house.kamerindeling}</p>
      <p>Huurkosten: {house.huurkosten}</p>
      <p>Servicekosten: {house.servicekosten}</p>
      <p>Energielabel: {house.energielabel}</p>
      <p>Locatie: {house.locatie}</p>
      <p>Type: {house.type}</p>
      <p>Beschrijving: {house.beschrijving}</p>
    </div>
  );
};

export default Housedetail;
