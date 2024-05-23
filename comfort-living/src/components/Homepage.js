import React, { useState } from 'react';
import Banner from './Banner';
import EasyAccess from './Easyaccess';
import News from './News';
import Housefilter from './Housefilter';
import './Homepage.css';


function Homepage() {

    const [filter, setFilter] = useState({});
  const [houses, setHouses] = useState([
    { id: 1, rooms: 3, size: 120, price: 250000, image: 'house1.jpg' },
    { id: 2, rooms: 4, size: 150, price: 300000, image: 'house2.jpg' },
    { id: 3, rooms: 2, size: 80, price: 200000, image: 'house3.jpg' },
    // Voeg meer huizen toe indien nodig
  ]);

const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    console.log('Geselecteerde filter:', newFilter);
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
    <div>
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
  )
}

export default Homepage
