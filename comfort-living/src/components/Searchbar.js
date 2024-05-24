import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Searchbar.css';

const Searchbar = () => {
    const [panden, setPanden] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPanden = panden.filter(panden =>
        panden.id && panden.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        fetchPanden();
    }, []);

    const fetchPanden = async () => {
        try {
            const response = await axios.get('http://localhost:3001/users');
            setPanden(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    return (
        <div className="searchbar-container">
            <h1>Zoek hier u Comfort Living</h1>
            <div className="search-input-container">
                <input
                    type="text"
                    placeholder="Search by ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="results-container">
                {filteredPanden.map((pand) => (
                    <div key={pand.id}>
                        <h2>{pand.voornaam} {pand.achternaam}</h2>
                        <p>ID: {pand.id}</p>
                        {/* Add more details as needed */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Searchbar;
