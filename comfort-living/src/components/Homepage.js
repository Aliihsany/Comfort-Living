import React, { useState, useEffect } from 'react';
import Banner from './Banner';
import Easyaccess from './Easyaccess';
import News from './News';
import Housefilter from './Housefilter';
import axios from 'axios';
import './Homepage.css';
import Slider from "react-slick";

function Homepage() {
  const [filter, setFilter] = useState({
    afbeelding: '',
    aantal: '',
    grootte: '',
    min: '',
    max: '',
    energielabel: '',
    locatie: '',
    type: ''
  });
  const [panden, setPanden] = useState([]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    console.log('Geselecteerde filter:', newFilter);
  };

  useEffect(() => {
    const fetchPanden = async () => {
      try {
        const response = await axios.get('http://localhost:3001/panden');
        setPanden(response.data);
      } catch (error) {
        console.error('Error fetching panden:', error);
      }
    };

    fetchPanden();
  }, []);

  const images = [
    "https://via.placeholder.com/600x400/ff0000/ffffff?text=Image+1",
    "https://via.placeholder.com/600x400/00ff00/ffffff?text=Image+2",
    "https://via.placeholder.com/600x400/0000ff/ffffff?text=Image+3",
    "https://via.placeholder.com/600x400/ffff00/000000?text=Image+4",
    "https://via.placeholder.com/600x400/00ffff/000000?text=Image+5"
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000
  };

  const filteredPanden = panden.filter(pand => {
    return (
      (filter.aantal ? pand.aantal === parseInt(filter.aantal) : true) &&
      (filter.grootte ? pand.grootte >= parseInt(filter.grootte) : true) &&
      (filter.min ? pand.min >= parseInt(filter.min) : true) &&
      (filter.max ? pand.max <= parseInt(filter.max) : true) &&
      (filter.energielabel ? pand.energielabel === filter.energielabel : true) &&
      (filter.locatie ? pand.locatie.toLowerCase().includes(filter.locatie.toLowerCase()) : true) &&
      (filter.type ? pand.type === filter.type : true)
    );
  });

  return (
    <div className="App">
      <header>
        <div className="logo">
          <img src="../assets/logo.jpg" alt="News" />
        </div>
        <nav>
          <a href="#">Ik huur</a>
          <a href="#">Ik zoek</a>
          <a href="#">Organisatie</a>
          <a href="#">Contact</a>
          <input type="text" placeholder="Search" />
          <a href="/login">Inloggen</a>
        </nav>
      </header>

      <Banner />
      <Easyaccess />

      <div className="carousel-root">
        <Slider {...settings} className="carousel">
          {images.map((image, index) => (
            <div key={index} className="slide">
              <img src={image} alt={`Slide ${index + 1}`} />
            </div>
          ))}
        </Slider>
      </div>

      <div className="content">
        <Housefilter onFilterChange={handleFilterChange} />
        <div className="house-list">
          {filteredPanden.map(pand => (
            <div key={pand.id} className="house-item">
              <img src={pand.afbeelding} alt={`House ${pand.id}`} />
              <p>Kamers: {pand.aantal}</p>
              <p>Grootte: {pand.grootte} m²</p>
              <p>Min. prijs: €{pand.min}</p>
              <p>Max. prijs: €{pand.max}</p>
              <p>Energielabel: {pand.energielabel}</p>
              <p>Locatie: {pand.locatie}</p>
              <p>Type: {pand.type}</p>
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
  );
}

export default Homepage;
