import React, { useState } from 'react';
import './Housefilter.css';

const Housefilter = ({ onFilterChange }) => {
  const [filter, setFilter] = useState({
    rooms: '',
    size: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilter({...filter, [name]: value});
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
      <button onClick={handleFilterClick}>Filter</button>
    </div>
  );
};

export default Housefilter;