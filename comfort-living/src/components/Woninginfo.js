import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './css/Woninginfo.css';
import Slider from 'react-slick';
import Header from './Header';
import Footer from './Footer';

const Woninginfo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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

  const handleSignUp = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You need to be logged in to sign up for a residence.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/signup-residence`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ residenceId: id })
      });
      if (response.ok) {
        alert('Successfully signed up for the residence! Check your email for confirmation.');
      } else {
        alert('Failed to sign up for the residence.');
      }
    } catch (error) {
      console.error('Error signing up for the residence:', error);
    }
  };

  const handleCompare = () => {
    navigate(`/compare/${id}`);
  };

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 2500,
    appendDots: dots => (
      <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
        <ul style={{ margin: '0px', padding: '0px' }}> {dots} </ul>
      </div>
    ),
    customPaging: i => (
      <div
        style={{
          width: '10px',
          height: '10px',
          backgroundColor: '#d9d9d9',
          borderRadius: '50%',
          display: 'inline-block',
          margin: '0 5px'
        }}
      ></div>
    )
  };

  if (!residence) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header /> 
      <div className="woninginfo-page">
        <nav>
          <a href="/">Home</a> &gt; <span>Woning: {residence.naam}</span>
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
            <button className="signup-button" onClick={handleSignUp}>Inschrijven</button>
            <button className="compare-button" onClick={handleCompare}>Vergelijken</button>
          </div>
          <div className="residence-right">
            <h2>Beschrijving</h2>
            <p>{residence.beschrijving}</p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Woninginfo;
