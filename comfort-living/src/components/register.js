import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
    const [formData, setFormData] = useState({
        voornaam: '',
        achternaam: '',
        geslacht: '',
        geboortedatum: '',
        woonadres: '',
        telefoonnummer: '',
        jaarinkomen: '',
        voorkeur: '',
        straal: '',
        rol: '',
        email: '',
        password: '',
        pdf: null,
        bewijsfoto: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            data.append(key, formData[key]);
        });

        try {
            const response = await axios.post('http://localhost:3001/register', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            alert(response.data);
        } catch (error) {
            console.error('There was an error!', error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="voornaam" placeholder="Voornaam" onChange={handleChange} required />
            <input type="text" name="achternaam" placeholder="Achternaam" onChange={handleChange} required />
            <input type="text" name="geslacht" placeholder="Geslacht" onChange={handleChange} required />
            <input type="date" name="geboortedatum" placeholder="Geboortedatum" onChange={handleChange} required />
            <input type="text" name="woonadres" placeholder="Woonadres" onChange={handleChange} required />
            <input type="tel" name="telefoonnummer" placeholder="Telefoonnummer" onChange={handleChange} required />
            <input type="text" name="jaarinkomen" placeholder="Jaarinkomen" onChange={handleChange} required />
            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
            <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
            <input type="file" name="pdf" onChange={handleChange} required />
            <input type="file" name="bewijsfoto" onChange={handleChange} required />
            <input type="text" name="voorkeur" placeholder="Voorkeur" onChange={handleChange} required />
            <input type="text" name="straal" placeholder="Straal" onChange={handleChange} required />
            <input type="text" name="rol" placeholder="Rol" onChange={handleChange} required />
            <button type="submit">Register</button>
        </form>
    );
};

export default Register;
