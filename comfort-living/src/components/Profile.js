import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './css/Profile.css';
import { FaEdit, FaTrash } from 'react-icons/fa';
import Header from './Header';
import { useNavigate, Link } from 'react-router-dom';

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
  const [residences, setResidences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
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

    const fetchResidences = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3001/users/me/residences', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          setResidences(response.data);
        } else {
          setError('Error fetching residences');
        }
      } catch (err) {
        setError('Error fetching residences');
      }
    };

    fetchUserData();
    fetchResidences();
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

  const handleDelete = async (residenceId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this signup?');
    if (!confirmDelete) {
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await axios.delete('http://localhost:3001/signup-residence', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        data: { residenceId }
      });
      if (response.status === 200) {
        alert('Successfully deleted residence signup');
        setResidences(residences.filter(residence => residence.id !== residenceId));
      } else {
        alert('Failed to delete residence signup');
      }
    } catch (err) {
      alert('Error deleting residence signup');
    }
  };

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
        <h2>Ingeschreven Residences</h2>
        <div className="residences-list">
          
          {residences.map((residence) => (
            <div key={residence.id} className="residence-item">
              <div className="residence-header">
                <h3><a href={`/woning/${residence.id}`}>{residence.naam}</a></h3>
                <FaTrash
                  className="delete-icon"
                  onClick={() => handleDelete(residence.id)}
                />
              </div>
              <p>{residence.beschrijving}</p>
              <p><strong>Locatie:</strong> {residence.locatie}</p>
              <p><strong>Huurkosten:</strong> €{residence.huurkosten}</p>
              <p><strong>Servicekosten:</strong> €{residence.servicekosten}</p>
              <p><strong>Energielabel:</strong> {residence.energielabel}</p>
              
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Profile;
