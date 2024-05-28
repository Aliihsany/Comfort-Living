import React, { useState } from 'react';
import './css/Housefilter.css';

const Housefilter = ({ onFilterChange }) => {
  const [filter, setFilter] = useState({
    kamerindeling: '',
    straal: '',
    minHuurkosten: '',
    maxHuurkosten: '',
    minServicekosten: '',
    maxServicekosten: '',
    energielabel: '',
    locatie: '', 
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
        <label>Kamerindeling:</label>
        <input type="number" name="kamerindeling" value={filter.kamerindeling} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Straal (m²):</label>
        <input type="number" name="straal" value={filter.straal} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Huurkosten (min):</label>
        <input type="number" name="minHuurkosten" value={filter.minHuurkosten} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Huurkosten (max):</label>
        <input type="number" name="maxHuurkosten" value={filter.maxHuurkosten} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Servicekosten (min):</label>
        <input type="number" name="minServicekosten" value={filter.minServicekosten} onChange={handleChange} />
      </div>
      <div className="filter-section">
        <label>Servicekosten (max):</label>
        <input type="number" name="maxServicekosten" value={filter.maxServicekosten} onChange={handleChange} />
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
          <option value="Appartement">Appartement</option>
          <option value="Huis">Huis</option>
          <option value="Studio">Studio</option>
          <option value="Villa">Villa</option>
        </select>
      </div>
      <button onClick={handleFilterClick}>Filter</button>
    </div>
  );
};

export default Housefilter;
