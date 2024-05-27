import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { FaEdit } from 'react-icons/fa';
import Header from './Header';

const Profile = () => {
  const [userData, setUserData] = useState({
    voornaam: '',
    achternaam: '',
    geboortedatum: '',
    woonadres: '',
    telefoonnummer: '',
    jaarinkomen: '',
    voorkeur: '',
    straal: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState({
    voornaam: false,
    achternaam: false,
    geboortedatum: false,
    woonadres: false,
    telefoonnummer: false,
    jaarinkomen: false,
    voorkeur: false,
    straal: false,
    email: false
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          const data = response.data;
          setUserData({
            voornaam: data.voornaam,
            achternaam: data.achternaam,
            geboortedatum: data.geboortedatum,
            woonadres: data.woonadres,
            telefoonnummer: data.telefoonnummer,
            jaarinkomen: data.jaarinkomen,
            voorkeur: data.voorkeur,
            straal: data.straal,
            email: data.email
          });
        } else {
          setError('Error fetching data');
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleEditClick = (field) => {
    setIsEditing((prevEditing) => ({
      ...prevEditing,
      [field]: !prevEditing[field]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const response = await axios.put('http://localhost:3001/users/me', userData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      });
      if (response.status === 200) {
        alert('Profile updated successfully!');
      } else {
        alert(`Error updating profile: ${response.data}`);
      }
    } catch (err) {
      alert('Error updating profile');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <>
      <Header />
      <div className="profile-container">
        <h1>Profile</h1>
        <form onSubmit={handleSubmit}>
          {Object.keys(userData).map((key) => (
            <div key={key} className="profile-field">
              <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
              {isEditing[key] ? (
                <input
                  type={key === 'geboortedatum' ? 'date' : key === 'email' ? 'email' : 'text'}
                  name={key}
                  value={userData[key]}
                  onChange={handleChange}
                />
              ) : (
                <span>{userData[key]}</span>
              )}
              <FaEdit
                className="edit-icon"
                onClick={() => handleEditClick(key)}
              />
            </div>
          ))}
          <button type="submit">Update Profile</button>
        </form>
      </div>
    </>
  );
};

export default Profile;
