import React, { useState } from 'react';

function Filters({ onFilterChange }) {
  const [filters, setFilters] = useState({
    energyLabel: '',
    maxPrice: '',
    // Voeg hier meer filters toe
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFilters = { ...filters, [name]: value };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div>
      <label>
        Energie Label:
        <select name="energyLabel" onChange={handleChange}>
          <option value="">Selecteer</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          {/* Voeg hier meer opties toe */}
        </select>
      </label>
      <label>
        Maximale Prijs:
        <input
          type="number"
          name="maxPrice"
          value={filters.maxPrice}
          onChange={handleChange}
        />
      </label>
      {/* Voeg hier meer filtercomponenten toe */}
    </div>
  );
}

export default Filters;
