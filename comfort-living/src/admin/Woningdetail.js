import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/Woningdetail.css';
import Sidebar from './Sidebar';

const WoningDetails = () => {
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

  if (!residence) {
    return <div>Loading...</div>;
  }

  return (
    <div className="app">
      <Sidebar />
      <div className="woning-details-page">
        <h1>{residence.naam}</h1>
        <p><strong>Kamerindeling:</strong> {residence.kamerindeling}</p>
        <p><strong>Huurkosten:</strong> {residence.huurkosten}</p>
        <p><strong>Servicekosten:</strong> {residence.servicekosten}</p>
        <p><strong>Energielabel:</strong> {residence.energielabel}</p>
        <p><strong>Locatie:</strong> {residence.locatie}</p>
        <p><strong>Type:</strong> {residence.type}</p>
        <div className="image-gallery">
          {residence.afbeelding_1 && <img src={residence.afbeelding_1} alt="Afbeelding 1" />}
          {residence.afbeelding_2 && <img src={residence.afbeelding_2} alt="Afbeelding 2" />}
          {residence.afbeelding_3 && <img src={residence.afbeelding_3} alt="Afbeelding 3" />}
        </div>
        <p><strong>Beschrijving:</strong> {residence.beschrijving}</p>
      </div>
    </div>
  );
};

export default WoningDetails;
