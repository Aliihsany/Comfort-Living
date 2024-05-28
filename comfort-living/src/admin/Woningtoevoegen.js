import React, { useState } from 'react';
import './css/Woningtoevoegen.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
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
      toast.success('Woning succesvol toegevoegd!');
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
      toast.error(`Fout bij het toevoegen van woning: ${error.message}`);
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
        toast.error('Alleen JPG en PNG bestanden zijn toegestaan.');
      }
    });
  };

  return (
    <div><ToastContainer />
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
          <select value={kamerindeling} onChange={(e) => setKamerindeling(e.target.value)} required>
            <option value="">Selecteer kamerindeling</option>
            <option value="1 kamer">1 kamer</option>
            <option value="2 kamers">2 kamers</option>
            <option value="3 kamers">3 kamers</option>
            <option value="4 kamers">4 kamers</option>
            <option value="5+ kamers">5+ kamers</option>
          </select>
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
          <select value={energielabel} onChange={(e) => setEnergielabel(e.target.value)} required>
            <option value="">Selecteer energielabel</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
            <option value="E">E</option>
            <option value="F">F</option>
            <option value="G">G</option>
          </select>
        </label>
        <label>
          Locatie:
          <input type="text" value={locatie} onChange={(e) => setLocatie(e.target.value)} required />
        </label>
        <label>
          Type:
          <select value={type} onChange={(e) => setType(e.target.value)} required>
            <option value="">Selecteer type</option>
            <option value="Appartement">Appartement</option>
            <option value="Eengezinswoning">Eengezinswoning</option>
            <option value="Studio">Studio</option>
            <option value="Villa">Villa</option>
          </select>
        </label>
        <label>
          Straal:
          <input type="text" value={straal} onChange={(e) => setStraal(e.target.value)} required />
        </label>
        <label>
          Beschrijving:
          <textarea 
            value={beschrijving} 
            onChange={(e) => setBeschrijving(e.target.value)} 
            maxLength="1000"
            required 
          />
          <small className="text-muted float-right">{beschrijving.length}/1000</small>
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
    </div>
  );
};

export default Woningtoevoegen;
