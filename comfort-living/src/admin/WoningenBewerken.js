import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './WoningenBewerken.css';

const WoningenBewerken = () => {
  const { id } = useParams();
  const [woning, setWoning] = useState({
    energielabel: '',
    locatie: '',
    type: '',
    naam: '',
    kamerindeling: '',
    huurkosten: 0,
    servicekosten: 0,
    straal: '',
    beschrijving: '',
    afbeelding_1: null,
    afbeelding_2: null,
    afbeelding_3: null
  });

  useEffect(() => {
    const fetchWoning = async () => {
      try {
        const response = await fetch(`http://localhost:3001/panden/${id}`);
        const data = await response.json();
        setWoning(data);
      } catch (error) {
        console.error('Error fetching woning:', error);
      }
    };

    fetchWoning();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setWoning({ ...woning, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:3001/panden/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(woning),
      });
      alert('Woninggegevens succesvol bijgewerkt!');
    } catch (error) {
      console.error('Error updating woning:', error);
      alert('Er is een fout opgetreden bij het bijwerken van de woninggegevens.');
    }
  };

  return (
    <div className="woningen-bewerken">
      <h2>Bewerk Woning</h2>
      <form onSubmit={handleSubmit} className="bewerk-form">
        <div className="form-group">
          <label>Naam:</label>
          <input type="text" name="naam" value={woning.naam} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Locatie:</label>
          <input type="text" name="locatie" value={woning.locatie} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Type:</label>
          <select name="type" value={woning.type} onChange={handleChange}>
            <option value="">Selecteer type</option>
            <option value="Appartement">Appartement</option>
            <option value="Eengezinswoning">Eengezinswoning</option>
            <option value="Studio">Studio</option>
            <option value="Villa">Villa</option>
          </select>
        </div>
        <div className="form-group">
          <label>Kamerindeling:</label>
          <select name="kamerindeling" value={woning.kamerindeling} onChange={handleChange}>
            <option value="">Selecteer kamerindeling</option>
            <option value="1 kamer">1 kamer</option>
            <option value="2 kamers">2 kamers</option>
            <option value="3 kamers">3 kamers</option>
            <option value="4 kamers">4 kamers</option>
            <option value="5+ kamers">5+ kamers</option>
          </select>
        </div>
        <div className="form-group">
          <label>Energielabel:</label>
          <select name="energielabel" value={woning.energielabel} onChange={handleChange}>
            <option value="">Selecteer energielabel</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
          </select>
        </div>
        <div className="form-group">
          <label>Huurkosten:</label>
          <input type="number" name="huurkosten" value={woning.huurkosten} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Servicekosten:</label>
          <input type="number" name="servicekosten" value={woning.servicekosten} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Straal:</label>
          <input type="text" name="straal" value={woning.straal} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Beschrijving:</label>
          <textarea name="beschrijving" value={woning.beschrijving} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Afbeelding 1:</label>
          <input type="file" name="afbeelding_1" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Afbeelding 2:</label>
          <input type="file" name="afbeelding_2" onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Afbeelding 3:</label>
          <input type="file" name="afbeelding_3" onChange={handleChange} />
        </div>
        
        <button type="submit" className="submit-button">Opslaan</button>
      </form>
    </div>
  );
};

export default WoningenBewerken;
