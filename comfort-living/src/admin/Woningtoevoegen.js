import React, { useState } from 'react';
import './Woningtoevoegen.css';
import Sidebar from './Sidebar';

const Woningtoevoegen = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [serviceCosts, setServiceCosts] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newResidence = { name, location, price, serviceCosts, description, images };

    fetch('http://localhost:3001/residences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newResidence),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      // Optionally clear the form
      setName('');
      setLocation('');
      setPrice('');
      setServiceCosts('');
      setDescription('');
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
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label>
          Locatie:
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </label>
        <label>
          Huurkosten:
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
        </label>
        <label>
          Servicekosten:
          <input type="number" value={serviceCosts} onChange={(e) => setServiceCosts(e.target.value)} required />
        </label>
        <label>
          Beschrijving:
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required />
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
