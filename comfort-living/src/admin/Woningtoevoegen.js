import React, { useState } from 'react';
import './Woningtoevoegen.css';

const Woningtoevoegen = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [price, setPrice] = useState('');
  const [serviceCosts, setServiceCosts] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newResidence = { name, location, price, serviceCosts, description, images };

    fetch('http://localhost:3000/residences', {
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
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const validFiles = files.filter(file => validTypes.includes(file.type));

    if (validFiles.length !== files.length) {
      alert('Only JPG, PNG, or WebP files are allowed.');
    }

    const imageUrls = validFiles.map(file => URL.createObjectURL(file));
    setImages(imageUrls);
  };

  return (
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
          Prijs:
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
          <input type="file" multiple onChange={handleImageChange} accept=".jpg,.jpeg,.png." />
        </label>
        <div className="image-preview">
          {images.map((image, index) => (
            <img key={index} src={image} alt={`Preview ${index}`} />
          ))}
        </div>
        <button type="submit">Voeg woning toe</button>
      </form>
    </div>
  );
};

export default Woningtoevoegen;
