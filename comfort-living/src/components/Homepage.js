import React, { useState, useEffect } from 'react';
import Banner from './Banner';
import EasyAccess from './Easyaccess';
import News from './News';
import Housefilter from './Housefilter';
import axios from 'axios';
import './Homepage.css';
import Header from './Header';
import Footer from './Footer';


function Homepage() {

  const [filter, setFilter] = useState({});
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
      (filter.aantal ? pand.aantal === filter.aantal : true) &&
      (filter.grootte ? pand.grootte >= filter.grootte : true) &&
      (filter.min ? pand.min >= filter.min : true) &&
      (filter.max ? pand.max <= filter.max : true)
    );
  });

  return (
    <div className="App">
        
      <Header />

      <Banner />
      <EasyAccess />

      <div className="content">
        <Housefilter onFilterChange={handleFilterChange} />
        <div className="house-list">
          {filteredPanden.map(pand => (
            <div key={pand.id} className="house-item">
              {/* Render de gegevens van elk pand */}
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

      <Footer />
    </div>
  );
}


export default Homepage
