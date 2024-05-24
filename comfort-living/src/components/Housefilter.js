import React, { useState } from 'react';
import './Housefilter.css';

const Housefilter = ({ onFilterChange }) => {
  const [filter, setFilter] = useState({
    rooms: '',
    size: '',
    minPrice: '',
    maxPrice: '',
    energyLabel: '',
    location: '', 
    type: '' 
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter({ ...filter, [name]: value });
  };

  const handleFilterClick = () => {
    onFilterChange(filter);
  };

  return (
    <div className="house-filter">
      <div className="filter-section">
        <label>Aantal kamers:</label>
        <input type="number" name="rooms" value={filter.rooms} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Grootte (m²):</label>
        <input type="number" name="size" value={filter.size} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Min. Prijs:</label>
        <input type="number" name="minPrice" value={filter.minPrice} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Max. Prijs:</label>
        <input type="number" name="maxPrice" value={filter.maxPrice} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Energielabel:</label>
        <select name="energyLabel" value={filter.energyLabel} onChange={handleChange}>
          <option value="">Selecteer energielabel</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
          <option value="G">G</option>
        </select>
      </div>
      <div className="filter-section">
        <label>Locatie:</label>
        <input type="text" name="location" value={filter.location} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Type woning:</label>
        <select name="type" value={filter.type} onChange={handleChange}>
          <option value="">Selecteer type woning</option>
          <option value="appartement">Appartement</option>
          <option value="huis">Huis</option>
          <option value="studio">Studio</option>
          <option value="villa">Villa</option>
        </select>
      </div>
      <button onClick={handleFilterClick}>Filter</button>
    </div>
  );
};

export default Housefilter;
