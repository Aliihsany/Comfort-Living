import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Userpage.css';
import UserDetailsModal from './Userdetail'; 
import Sidebar from './Sidebar';

const Userpage = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3001/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleBlockUser = async (id) => {
    try {
      const response = await axios.post('http://localhost:3001/block-user', { id });
      console.log(response.data); // Log the response to check the success message
      fetchUsers(); // Refresh the list after blocking
    } catch (error) {
      console.error('Error blocking user:', error.response ? error.response.data : error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm('Weet je zeker dat je deze gebruiker wilt verwijderen?');

    if (confirmDelete) {
      try {
        const response = await axios.delete(`http://localhost:3001/users/${id}`);
        console.log(response.data); // Log the response to check the success message
        fetchUsers(); // Refresh the list after deletion
      } catch (error) {
        console.error('Error deleting user:', error.response ? error.response.data : error.message);
      }
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
              <th>Info</th>
              <th>Voornaam</th>
              <th>Achternaam</th>
              <th>Email</th>
              <th>Geblokkeerd</th>
              <th>Acties</th>
              <th>Verwijderen</th> 
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{ backgroundColor: user.blocked ? '#f8d7da' : 'transparent' }}>
                <td onClick={() => setSelectedUser(user)} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Info</td>
                <td>{user.voornaam}</td>
                <td>{user.achternaam}</td>
                <td>{user.email}</td>
                <td>{user.blocked ? 'Ja' : 'Nee'}</td>
                <td>
                  <button onClick={() => handleBlockUser(user.id)} disabled={user.blocked}>
                    {user.blocked ? 'Geblokkeerd' : 'Blokkeer'}
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
