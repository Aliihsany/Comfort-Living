import React, { useState, useEffect } from 'react';
import './Woningen.css';
import Sidebar from './Sidebar';
import { Link } from 'react-router-dom';

const Woningen = () => {
  const [residences, setResidences] = useState([]);

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

  return (
    <div className="app">
      <Sidebar />
      <div className="woningen-page">
        <h1>Residences</h1>
        <table>
          <thead>
            <tr>
              <th>Naam</th>
              <th>Kamerindeling</th>
              <th>Huurkosten</th>
              <th>Servicekosten</th>
              <th>Energielabel</th>
              <th>Locatie</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {residences.map((residence) => (
              <tr key={residence.id}>
                <td>
                  <Link to={`/woningdetail/${residence.id}`}>{residence.naam}</Link>
                </td>
                <td>{residence.kamerindeling}</td>
                <td>{residence.huurkosten}</td>
                <td>{residence.servicekosten}</td>
                <td>{residence.energielabel}</td>
                <td>{residence.locatie}</td>
                <td>{residence.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Woningen;
