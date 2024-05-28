import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './css/Compare.css';
import Header from './Header';
import Footer from './Footer';

const Compare = () => {
  const { id } = useParams();
  const [residences, setResidences] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResidences();
  }, [id]);

  const fetchResidences = async () => {
    try {
      const response = await fetch(`http://localhost:3001/compare/${id}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setResidences(data);
    } catch (error) {
      console.error('Error fetching residences:', error);
      setError(error.message);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!residences.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <div className="compare-page">
        <h1>Vergelijken</h1>
        <div className="compare-container">
          {residences.map(residence => (
            <div key={residence.id} className="residence-card">
              <h2>{residence.naam}</h2>
              <p>{residence.beschrijving}</p>
              <p><strong>Huurkosten:</strong> €{residence.huurkosten}</p>
              <p><strong>Servicekosten:</strong> €{residence.servicekosten}</p>
              <p><strong>Energielabel:</strong> {residence.energielabel}</p>
              <p><strong>Locatie:</strong> {residence.locatie}</p>
              <p><strong>Type:</strong> {residence.type}</p>
              <p><strong>Straal:</strong> {residence.straal}</p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Compare;
