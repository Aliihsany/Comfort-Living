import React, { useState, useEffect } from 'react';
import Banner from './Banner';
import EasyAccess from './Easyaccess';
import News from './News';
import Housefilter from './Housefilter';
import axios from 'axios';
import './Homepage.css';

function Homepage() {
  const [filter, setFilter] = useState({
    aantal: '',
    grootte: '',
    min: '',
    max: '',
    energielabel: '',
    locatie: '',
    type: ''
  });
  const [panden, setPanden] = useState([]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    console.log('Geselecteerde filter:', newFilter);
  };

  useEffect(() => {
    const fetchPanden = async () => {
      try {
        const response = await axios.get('http://localhost:3001/panden');
        setPanden(response.data);
      } catch (error) {
        console.error('Error fetching panden:', error);
      }
    };

    fetchPanden();
  }, []);

  const filteredPanden = panden.filter(pand => {
    return (
      (filter.aantal ? pand.aantal === parseInt(filter.aantal) : true) &&
      (filter.grootte ? pand.grootte >= parseInt(filter.grootte) : true) &&
      (filter.min ? pand.min >= parseInt(filter.min) : true) &&
      (filter.max ? pand.max <= parseInt(filter.max) : true) &&
      (filter.energielabel ? pand.energielabel === filter.energielabel : true) &&
      (filter.locatie ? pand.locatie.toLowerCase().includes(filter.locatie.toLowerCase()) : true) &&
      (filter.type ? pand.type === filter.type : true)
    );
  });

  return (
    <div className="App">
      <header>
        <div className="logo">
          <img src="../assets/logo.jpg" alt="News" />
        </div>
        <nav>
          <a href="#">Ik huur</a>
          <a href="#">Ik zoek</a>
          <a href="#">Organisatie</a>
          <a href="#">Contact</a>
          <input type="text" placeholder="Search" />
          <a href="/login">Inloggen</a>
        </nav>
      </header>

      <Banner />
      <EasyAccess />

      <div className="content">
        <Housefilter onFilterChange={handleFilterChange} />
        <div className="house-list">
          {filteredPanden.map(pand => (
            <div key={pand.id} className="house-item">
              <img src={pand.image} alt={`House ${pand.id}`} />
              <p>Kamers: {pand.aantal}</p>
              <p>Grootte: {pand.grootte} m²</p>
              <p>Min. prijs: €{pand.min}</p>
              <p>Max. prijs: €{pand.max}</p>
              <p>Energielabel: {pand.energielabel}</p>
              <p>Locatie: {pand.locatie}</p>
              <p>Type: {pand.type}</p>
            </div>
          ))}
        </div>
      </div>

      <News />

      <footer>
        <div className="customer-service">
          <a href="#">Contact</a>
          <a href="#">Veelgestelde vragen</a>
        </div>
        <div className="social-media">
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">Twitter</a>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
