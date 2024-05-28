import React, { useState, useEffect } from 'react';
import './css/Woningen.css';
import Sidebar from './Sidebar';
import { Link, useNavigate } from 'react-router-dom';

const Woningen = () => {
  const [residences, setResidences] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResidences();
  }, []);

  const fetchResidences = async () => {
    try {
      const response = await fetch('http://localhost:3001/panden');
      const data = await response.json();
      setResidences(data);
    } catch (error) {
      console.error('Error fetching residences:', error);
    }
  };

  const handleDeleteResidence = async (id) => {
    const confirmDelete = window.confirm('Weet je zeker dat je deze woning wilt verwijderen?');
    if (confirmDelete) {
      try {
        await fetch(`http://localhost:3001/panden/${id}`, {
          method: 'DELETE',
        });
        setResidences(residences.filter(residence => residence.id !== id));
      } catch (error) {
        console.error('Fout bij het verwijderen van de woning:', error);
      }
    }
  };

  const handleEditResidence = (id) => {
    navigate(`/woningen/${id}/bewerken`);
  };

  return (
    <div className="app">
      <Sidebar />
      <div className="woningen-page">
        <h1>Woningen</h1>
        <table>
          <thead>
            <tr>
              <th>Naam</th>
              <th>Afbeelding</th>
              <th>Kamerindeling</th>
              <th>Huurkosten</th>
              <th>Servicekosten</th>
              <th>Straal</th>
              <th>Energielabel</th>
              <th>Locatie</th>
              <th>Type</th>
              <th>Bewerk woning</th>
              <th>Verwijder woning</th>
            </tr>
          </thead>
          <tbody>
            {residences.map((residence) => (
              <tr key={residence.id}>
                <td>
                  <Link to={`/woningdetail/${residence.id}`}>{residence.naam}</Link>
                </td>
                <td><img src={residence.afbeelding_1} alt="Afbeelding 1" /></td>
                <td>{residence.kamerindeling}</td>
                <td>{residence.huurkosten}</td>
                <td>{residence.servicekosten}</td>
                <td>{residence.straal}</td>
                <td>{residence.energielabel}</td>
                <td>{residence.locatie}</td>
                <td>{residence.type}</td>
                
                <td>
                  <button onClick={() => handleEditResidence(residence.id)}>
                    Bewerken
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDeleteResidence(residence.id)}>
                    Verwijderen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Woningen;
