import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Profile.css';
import { FaEdit } from 'react-icons/fa';
import Header from './Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
            email: data.email,
            geboortedatum: data.geboortedatum,
            woonadres: data.woonadres,
            telefoonnummer: data.telefoonnummer,
            jaarinkomen: data.jaarinkomen,
            voorkeur: data.voorkeur,
            straal: data.straal
            
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
        toast.success('Profile updated successfully!', {
          autoClose: 3000,
        });
      } else {
        toast.error(`Error updating profile: ${response.data}`, {
          autoClose: 3000,
        });
      }
    } catch (err) {
      toast.error('Error updating profile', {
        autoClose: 3000,
      });
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete your profile?')) {
      try {
        const response = await axios.delete('http://localhost:3001/users/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (response.status === 200) {
          toast.success('Profile deleted successfully!', {
            autoClose: 3000,
          });
          localStorage.removeItem('token');
          window.location.href = '/';
        } else {
          toast.error('Error deleting profile', {
            autoClose: 3000,
          });
        }
      } catch (err) {
        toast.error('Error deleting profile', {
          autoClose: 3000,
        });
      }
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
        <h1>Profiel</h1>
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
          <button type="submit">Update Profiel</button>
          <button type="button" className="delete-button" onClick={handleDelete}>
            Delete Profiel
          </button>
        </form>
      </div>
      <ToastContainer />
    </>
  );
};

export default Profile;
