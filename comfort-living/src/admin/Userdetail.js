import React from 'react';
import './css/Userdetail.css';

const UserDetailsModal = ({ user, onClose }) => {
  if (!user) return null;

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={onClose}>&times;</span>
        <h2>Gebruiker Details</h2>
        <p>ID: {user.id}</p>
        <p>Voornaam: {user.voornaam}</p>
        <p>Achternaam: {user.achternaam}</p>
        <p>Geslacht: {user.geslacht}</p>
        <p>Geboortedatum: {user.geboortedatum}</p>
        <p>Woonadres: {user.woonadres}</p>
        <p>Telefoonnummer: {user.telefoonnummer}</p>
        <p>Jaarinkomen: {user.jaarinkomen}</p>
        <p>Email: {user.email}</p>
        <p>Rol: {user.rol}</p>
        <p>Is Email Verified: {user.is_verified ? 'Yes' : 'No'}</p>
      </div>
    </div>
  );
};

export default UserDetailsModal;
