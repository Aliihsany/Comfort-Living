import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Woninginfo.css';
import Slider from 'react-slick';
import Header from './Header'; // Import Header component
import Footer from './Footer'; // Import Footer component

const Woninginfo = () => {
  const { id } = useParams();
  const [residence, setResidence] = useState(null);

  useEffect(() => {
    fetchResidence();
  }, [id]);

  const fetchResidence = async () => {
    try {
      const response = await fetch(`http://localhost:3001/panden/${id}`);
      const data = await response.json();
      setResidence(data);
    } catch (error) {
      console.error('Error fetching residence:', error);
    }
  };

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  if (!residence) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header /> {/* Add Header component */}
      <div className="woninginfo-page">
        <nav>
          <a href="/">Home</a> &gt; <a href="/aanbod">Aanbod</a> &gt; <span>{residence.naam}</span>
        </nav>
        <div className="residence-container">
          <div className="residence-left">
            <h1>{residence.naam}</h1>
            <Slider {...sliderSettings} className="image-slider">
              {residence.afbeelding_1 && <div><img src={residence.afbeelding_1} alt="Afbeelding 1" /></div>}
              {residence.afbeelding_2 && <div><img src={residence.afbeelding_2} alt="Afbeelding 2" /></div>}
              {residence.afbeelding_3 && <div><img src={residence.afbeelding_3} alt="Afbeelding 3" /></div>}
            </Slider>
            <div className="residence-specs">
              <h2>Specificaties</h2>
              <table>
                <tbody>
                  <tr>
                    <td><strong>Kamerindeling:</strong></td>
                    <td>{residence.kamerindeling}</td>
                  </tr>
                  <tr>
                    <td><strong>Huurkosten:</strong></td>
                    <td>€{residence.huurkosten}</td>
                  </tr>
                  <tr>
                    <td><strong>Servicekosten:</strong></td>
                    <td>€{residence.servicekosten}</td>
                  </tr>
                  <tr>
                    <td><strong>Energielabel:</strong></td>
                    <td>{residence.energielabel}</td>
                  </tr>
                  <tr>
                    <td><strong>Locatie:</strong></td>
                    <td>{residence.locatie}</td>
                  </tr>
                  <tr>
                    <td><strong>Type:</strong></td>
                    <td>{residence.type}</td>
                  </tr>
                  <tr>
                    <td><strong>Straal:</strong></td>
                    <td>{residence.straal}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className="residence-right">
            <h2>Beschrijving</h2>
            <p>{residence.beschrijving}</p>
          </div>
        </div>
      </div>
      <Footer /> {/* Add Footer component */}
    </div>
  );
};

export default Woninginfo;
