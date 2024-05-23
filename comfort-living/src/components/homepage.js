import React, { useState, useEffect } from 'react';
import Filters from './Filters';

function HomePage() {
  const [filterValues, setFilterValues] = useState({});
  const [houses, setHouses] = useState([]); // Oorspronkelijke lijst van woningen
  const [filteredHouses, setFilteredHouses] = useState([]); // Gefilterde lijst van woningen

  useEffect(() => {
    // Deze effect hook zou een API-aanroep doen om de lijst van woningen op te halen
    fetch('http://localhost:3001/houses')
      .then(response => response.json())
      .then(data => {
        setHouses(data);
        setFilteredHouses(data);
      });
  }, []);

  const handleFilterChange = (filters) => {
    setFilterValues(filters);
    applyFilters(filters);
  };

  const applyFilters = (filters) => {
    let filtered = houses;

    if (filters.energyLabel) {
      filtered = filtered.filter(house => house.energyLabel === filters.energyLabel);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(house => house.price <= filters.maxPrice);
    }

    // Voeg hier meer filterlogica toe

    setFilteredHouses(filtered);
  };

  return (
    <div>
      <h1>Home Page</h1>
      <Filters onFilterChange={handleFilterChange} />
      <div>
        {filteredHouses.map(house => (
          <div key={house.id}>
            <h2>{house.title}</h2>
            <p>{house.description}</p>
            <p>Prijs: {house.price}</p>
            <p>Energie Label: {house.energyLabel}</p>
            {/* Voeg hier meer woningdetails toe */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;
