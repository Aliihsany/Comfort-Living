import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Searchbar.css';

const Searchbar = () => {
  const [panden, setPanden] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

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

  return (
    <div className="searchbar-container">
      <h1>Zoek hier uw Comfort Living</h1>
      <div className="search-input-container">
        <input
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {searchTerm && (
        <div className="results-container">
          {filteredPanden.map((pand) => (
            <div key={pand.id} className="residence-card">
              <h2>{pand.naam}</h2>
              <p>{pand.afbeelding_1}</p>
              <p>Huurkosten: {pand.huurkosten}</p>
              <p>Locatie: {pand.locatie}</p>
              <p>Type: {pand.type}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Searchbar;
