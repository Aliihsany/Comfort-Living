import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Searchbar.css';
import { useNavigate } from 'react-router-dom';

const Searchbar = () => {
  const [panden, setPanden] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (searchTerm) {
      fetchPanden();
    } else {
      setPanden([]); // Clear the results when search term is empty
    }
  }, [searchTerm]);

  const fetchPanden = async () => {
    try {
      const response = await axios.get('http://localhost:3001/panden', {
        params: { naam: searchTerm }
      });
      setPanden(response.data);
    } catch (error) {
      console.error('Error fetching residences:', error);
    }
  };

  const filteredPanden = panden.filter(pand =>
    pand.naam.toLowerCase() === searchTerm.toLowerCase()
  );

  const handleHouseClick = (id) => {
    navigate(`/woning/${id}`);
  };

  return (
    <div className="searchbar-container">
      <h1>Zoek specifiek hier uw Comfort Living</h1>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Zoek bij naam"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {searchTerm && (
        <div className="results-container">
          {filteredPanden.map((pand) => (
            <div key={pand.naam} className="residence-card" onClick={() => handleHouseClick(pand.id)}>
              <h2 onClick={() => handleHouseClick(pand.id)}>{pand.naam}</h2>
              <p><img onClick={() => handleHouseClick(pand.id)} src={pand.afbeelding_1} alt="Afbeelding 1" /></p>
              <p onClick={() => handleHouseClick(pand.id)}>Huurkosten: {pand.huurkosten}</p>
              <p onClick={() => handleHouseClick(pand.id)}>Locatie: {pand.locatie}</p>
              <p onClick={() => handleHouseClick(pand.id)}>Type: {pand.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
