import React, { useState } from 'react';
import Banner from './components/Banner';
import EasyAccess from './components/Easyaccess';
import News from './components/News';
import Housefilter from './components/Housefilter';
import Overons from './components/Overons';
import './App.css';

function App() {
  const [filter, setFilter] = useState({});
  const [houses, setHouses] = useState([
    { id: 1, rooms: 3, size: 120, price: 250000, image: 'house1.jpg' },
    { id: 2, rooms: 4, size: 150, price: 300000, image: 'house2.jpg' },
    { id: 3, rooms: 2, size: 80, price: 200000, image: 'house3.jpg' },
    // Add more houses as needed
  ]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    console.log('Selected filter:', newFilter);
  };

  const filteredHouses = houses.filter(house => {
    return (
      (filter.rooms ? house.rooms === filter.rooms : true) &&
      (filter.size ? house.size >= filter.size : true) &&
      (filter.minPrice ? house.price >= filter.minPrice : true) &&
      (filter.maxPrice ? house.price <= filter.maxPrice : true)
    );
  });

  return (
    <div className="App">
      <header>
        <div className="logo">
          <img src="../assets/logo.jpg" alt="Logo" />
        </div>
        <nav>
          <a href="#">Ik huur</a>
          <a href="#">Ik zoek</a>
          <a href="#">Organisatie</a>
          <a href="#">Contact</a>
          <input type="text" placeholder="Search" />
          <a href="#">Inloggen</a>
        </nav>
      </header>

      <Banner />
      <EasyAccess />

      <div className="content">
        <Housefilter onFilterChange={handleFilterChange} />
        <div className="house-list">
          {filteredHouses.map(house => (
            <div key={house.id} className="house-item">
              <img src={house.image} alt={`House ${house.id}`} />
              <p>Kamers: {house.rooms}</p>
              <p>Grootte: {house.size} m²</p>
              <p>Prijs: €{house.price}</p>
            </div>
          ))}
        </div>
      </div>

      <News />
      <Overons /> {/* Include the Overons component */}

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

export default App;
