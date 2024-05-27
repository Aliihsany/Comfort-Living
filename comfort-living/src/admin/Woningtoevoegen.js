import React, { useState } from 'react';
import './Woningtoevoegen.css';
import Sidebar from './Sidebar';

const Woningtoevoegen = () => {
  const [naam, setNaam] = useState('');
  const [kamerindeling, setKamerindeling] = useState('');
  const [huurkosten, setHuurkosten] = useState('');
  const [servicekosten, setServicekosten] = useState('');
  const [energielabel, setEnergielabel] = useState('');
  const [locatie, setLocatie] = useState('');
  const [type, setType] = useState('');
  const [straal, setStraal] = useState('');
  const [beschrijving, setBeschrijving] = useState('');
  const [afbeeldingen, setAfbeeldingen] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newResidence = { naam, kamerindeling, huurkosten, servicekosten, energielabel, locatie, type, straal, beschrijving, ...afbeeldingen };

    fetch('http://localhost:3001/panden', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newResidence),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      console.log('Success:', data);
      // Optionally clear the form
      setNaam('');
      setKamerindeling('');
      setHuurkosten('');
      setServicekosten('');
      setEnergielabel('');
      setLocatie('');
      setType('');
      setStraal('');
      setBeschrijving('');
      setAfbeeldingen({});
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png'];

    files.forEach((file, index) => {
      if (validTypes.includes(file.type)) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setAfbeeldingen(prevImages => ({ ...prevImages, [`afbeelding_${index + 1}`]: event.target.result }));
        };
        reader.readAsDataURL(file);
      } else {
        alert('Only JPG and PNG files are allowed.');
      }
    });
  };

  return (
    <div className="sidebar">
        <Sidebar />

    <div className="woningtoevoegen">
      <h1>Voeg Woning toe</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Naam:
          <input type="text" value={naam} onChange={(e) => setNaam(e.target.value)} required />
        </label>
        <label>
          Kamerindeling:
          <input type="text" value={kamerindeling} onChange={(e) => setKamerindeling(e.target.value)} required />
        </label>
        <label>
          Huurkosten:
          <input type="number" value={huurkosten} onChange={(e) => setHuurkosten(e.target.value)} required />
        </label>
        <label>
          Servicekosten:
          <input type="number" value={servicekosten} onChange={(e) => setServicekosten(e.target.value)} required />
        </label>
        <label>
          Energielabel:
          <input type="text" value={energielabel} onChange={(e) => setEnergielabel(e.target.value)} required />
        </label>
        <label>
          Locatie:
          <input type="text" value={locatie} onChange={(e) => setLocatie(e.target.value)} required />
        </label>
        <label>
          Type:
          <input type="text" value={type} onChange={(e) => setType(e.target.value)} required />
        </label>
        <label>
          Straal:
          <input type="text" value={straal} onChange={(e) => setStraal(e.target.value)} required />
        </label>
        <label>
          Beschrijving:
          <textarea value={beschrijving} onChange={(e) => setBeschrijving(e.target.value)} required />
        </label>
        <label>
          Afbeeldingen:
          <input type="file" multiple onChange={handleImageChange} accept=".jpg,.jpeg,.png" />
        </label>
        <div className="image-slider">
          {Object.values(afbeeldingen).map((image, index) => (
            <img key={index} src={image} alt={`Preview ${index + 1}`} style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '5px' }} />
          ))}
        </div>
        <button type="submit">Voeg woning toe</button>
      </form>
    </div>
    </div>
  );
};

export default Woningtoevoegen;
