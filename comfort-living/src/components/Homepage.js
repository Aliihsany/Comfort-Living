import React, { useState, useEffect } from 'react';
import Banner from './Banner';
import Easyaccess from './Easyaccess';
import Housefilter from './Housefilter';
import axios from 'axios';
import './Homepage.css';
import Slider from "react-slick";
import Searchbar from './Searchbar';
import Footer from './Footer';
import Header from './Header';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

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
      (filter.aantal ? pand.kamerindeling === parseInt(filter.aantal) : true) &&
      (filter.grootte ? pand.grootte >= parseInt(filter.grootte) : true) &&
      (filter.min ? pand.huurkosten >= parseInt(filter.min) : true) &&
      (filter.max ? pand.huurkosten <= parseInt(filter.max) : true) &&
      (filter.energielabel ? pand.energielabel === filter.energielabel : true) &&
      (filter.locatie ? pand.locatie.toLowerCase().includes(filter.locatie.toLowerCase()) : true) &&
      (filter.type ? pand.type === filter.type : true)
    );
  });

  const handleHouseClick = (id) => {
    navigate(`/house/${id}`);
  };

  return (
    <div className="App">
      <Header />
      <Banner />
      <Easyaccess />
      <Searchbar />
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
            <div key={pand.id} className="house-item" onClick={() => handleHouseClick(pand.id)}>
              <img src={pand.afbeelding} alt={`House ${pand.id}`} />
              <p>Kamers: {pand.kamerindeling}</p>
              <p>Huurkosten: €{pand.huurkosten}</p>
              <p>Servicekosten: €{pand.servicekosten}</p>
              <p>Energielabel: {pand.energielabel}</p>
              <p>Locatie: {pand.locatie}</p>
              <p>Type: {pand.type}</p>
              <p>Beschrijving: {pand.beschrijving}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Homepage;
