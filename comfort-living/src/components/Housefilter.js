import React, { useState } from 'react';
import './css/Housefilter.css';

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
        <input type="number" name="aantal" value={filter.aantal} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Grootte (m²):</label>
        <input type="number" name="grootte" value={filter.grootte} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Min. Prijs:</label>
        <input type="number" name="min" value={filter.min} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Max. Prijs:</label>
        <input type="number" name="max" value={filter.max} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Energielabel:</label>
        <select name="energielabel" value={filter.energielabel} onChange={handleChange}>
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
        <input type="text" name="locatie" value={filter.locatie} onChange={handleChange} />
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
