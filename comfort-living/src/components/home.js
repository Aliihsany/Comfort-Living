import React, {useEffect, useState} from 'react';
import axios from 'axios';

const Homepage = () => {
    const [car, setCar] = useState(null);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchRandomCar = async () => {
        try {
          const response = await axios.get('https://www.carqueryapi.com/api/0.3/?cmd=getTrims&make=ford&year=2015');
          const carData = response.data.Trims[Math.floor(Math.random() * response.data.Trims.length)];
          setCar(carData);
        } catch (err) {
          setError(err);
        }
      };
  
      fetchRandomCar();
    }, []);
  
    if (error) return <div>Error fetching car data: {error.message}</div>;
  
    return (
      <div>
        {car ? (
          <div>
            <h2>Random Car</h2>
            <p>Make: {car.make}</p>
            <p>Model: {car.model}</p>
            <p>Year: {car.year}</p>
            <p>Trim: {car.trim}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  };

export default Homepage;
﻿
