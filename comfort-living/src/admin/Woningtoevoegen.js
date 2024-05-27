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
  const [beschrijving, setBeschrijving] = useState('');
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newResidence = { naam, kamerindeling, huurkosten, servicekosten, energielabel, locatie, type, beschrijving };

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
      setBeschrijving('');
      setImages([]);
      setCurrentImageIndex(0);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png'];
    const validFiles = files.filter(file => validTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      alert('Only JPG and PNG files are allowed.');
    }

    const imageUrls = validFiles.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...imageUrls]);
    setCurrentImageIndex(0); // Reset to the first image when new images are added
  };

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
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
          Beschrijving:
          <textarea value={beschrijving} onChange={(e) => setBeschrijving(e.target.value)} required />
        </label>
        <label>
          Afbeeldingen:
          <input type="file" multiple onChange={handleImageChange} accept=".jpg,.jpeg,.png" />
        </label>
        <div className="image-slider">
          {images.length > 0 && (
            <>
              <button type="button" onClick={prevImage}>Previous</button>
              <img src={images[currentImageIndex]} alt={`Preview ${currentImageIndex}`} />
              <button type="button" onClick={nextImage}>Next</button>
            </>
          )}
        </div>
        <button type="submit">Voeg woning toe</button>
      </form>
    </div>
    </div>
  );
};

export default Woningtoevoegen;
