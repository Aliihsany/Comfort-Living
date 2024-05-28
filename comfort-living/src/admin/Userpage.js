import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/Userpage.css';
import UserDetailsModal from './Userdetail';
import Sidebar from './Sidebar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/free-solid-svg-icons';

const Userpage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleBlockUser = async (id) => {
    try {
      const response = await axios.put('http://localhost:3001/block-user', { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data); 
      fetchUsers();
    } catch (error) {
      console.error('Error blocking user:', error.response ? error.response.data : error.message);
    }
  };

  const handleUnblockUser = async (id) => {
    try {
      const response = await axios.put('http://localhost:3001/unblock-user', { id }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data);
      fetchUsers(); 
    } catch (error) {
      console.error('Error unblocking user:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?');

    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:3001/users/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        console.log(response.data);
        fetchUsers(); 
      } catch (error) {
        console.error('Error deleting user:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleChangeRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const response = await axios.put('http://localhost:3001/change-role', { id, newRole }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      console.log(response.data); 
      fetchUsers(); 
    } catch (error) {
      console.error('Error changing user role:', error.response ? error.response.data : error.message);
    }
  };

  const filteredUsers = users.filter(user =>
    `${user.voornaam} ${user.achternaam}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="sidebar">
      <Sidebar />
      <div className="users-page">
        <h1>Gebruikers</h1>
        <input
          type="text"
          placeholder="Zoeken op naam"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th><FontAwesomeIcon icon={faCircleInfo} /></th>
              <th>Voornaam</th>
              <th>Achternaam</th>
              <th>Email</th>
              <th>Geblokkeerd</th>
              <th>Rol</th>
              <th>Acties</th>
              <th>Promote</th>
              <th>Verwijderen</th> 
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{ backgroundColor: user.blocked ? '#f8d7da' : 'transparent' }}>
                <td onClick={() => setSelectedUser(user)} style={{ cursor: 'pointer', textDecoration: 'underline' }}><FontAwesomeIcon icon={faCircleInfo} style={{ color: 'Blue' }} /></td>
                <td>{user.voornaam}</td>
                <td>{user.achternaam}</td>
                <td>{user.email}</td>
                <td>{user.blocked ? 'Ja' : 'Nee'}</td>
                <td>{user.rol}</td>
                <td>
                  <button onClick={() => user.blocked ? handleUnblockUser(user.id) : handleBlockUser(user.id)}>
                    {user.blocked ? 'Deblokkeer' : 'Blokkeer'}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleChangeRole(user.id, user.rol)}>
                    {user.rol === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDeleteUser(user.id)}>
                    Verwijderen
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {selectedUser && <UserDetailsModal user={selectedUser} onClose={() => setSelectedUser(null)} />}
      </div>
    </div>
  );
};

export default Userpage;
