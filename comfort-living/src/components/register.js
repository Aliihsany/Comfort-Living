import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import './Register.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faHome, faPhone, faMoneyBill, faGlobe, faRuler, faFilePdf, faCamera, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

const Register = () => {
    const [formData, setFormData] = useState({
        voornaam: '',
        achternaam: '',
        geslacht: '',
        geboortedatum: null,
        woonadres: '',
        telefoonnummer: '',
        jaarinkomen: '',
        voorkeur: '',
        straal: '',
        email: '',
        password: '',
        pdf: null,
        bewijsfoto: null,
    });

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [showTerms, setShowTerms] = useState(false);
    const [passwordError, setPasswordError] = useState('');
    const [showPasswordTooltip, setShowPasswordTooltip] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [maxDate, setMaxDate] = useState(null);

    useEffect(() => {
        const today = new Date();
        const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
        setMaxDate(eighteenYearsAgo);
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }

        if (name === 'password') {
            evaluatePasswordStrength(value);
        }
    };

    const handleDateChange = (date) => {
        setFormData({ ...formData, geboortedatum: date });
    };

    const handleTermsChange = (e) => {
        setTermsAccepted(e.target.checked);
    };

    const evaluatePasswordStrength = (password) => {
        const strength = validatePasswordStrength(password);
        setPasswordStrength(strength);
    };

    const validatePasswordStrength = (password) => {
        const minLength = 8;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
        const hasUppercase = /[A-Z]/;
        const hasNumber = /[0-9]/;

        let strength = 0;

        if (password.length >= minLength) strength += 1;
        if (hasSpecialChar.test(password)) strength += 1;
        if (hasUppercase.test(password)) strength += 1;
        if (hasNumber.test(password)) strength += 1;

        return (strength / 4) * 100;
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
        const hasUppercase = /[A-Z]/;
        const hasNumber = /[0-9]/;

        if (password.length < minLength) {
            return 'Wachtwoord moet minimaal 8 tekens lang zijn.';
        } else if (!hasSpecialChar.test(password)) {
            return 'Wachtwoord moet minimaal 1 speciaal teken bevatten.';
        } else if (!hasUppercase.test(password)) {
            return 'Wachtwoord moet minimaal 1 hoofdletter bevatten.';
        } else if (!hasNumber.test(password)) {
            return 'Wachtwoord moet minimaal 1 cijfer bevatten.';
        } else {
            return '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const passwordValidationResult = validatePassword(formData.password);
        if (passwordValidationResult) {
            setPasswordError(passwordValidationResult);
            return;
        }

        if (!termsAccepted) {
            alert('U moet akkoord gaan met de algemene voorwaarden om u te registreren.');
            return;
        }

        const data = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'geboortedatum') {
                data.append(key, dateToString(formData[key]));
            } else {
                data.append(key, formData[key]);
            }
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

    const dateToString = (date) => {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${year}-${month}-${day}`;
    };

    const toggleTermsModal = () => {
        setShowTerms(!showTerms);
    };

    const handlePasswordFocus = () => {
        setShowPasswordTooltip(true);
    };

    const handlePasswordBlur = () => {
        setShowPasswordTooltip(false);
    };

    const handleClick = () => {
        setTimeout(() => {
          window.location.href = '/login';
        }, 1000);
        
      };

    return (
        <>

            <form onSubmit={handleSubmit} className="register-form">
                <h1 style={{position: 'relative', bottom: '10px'}}>Register</h1>
                <div className="flex-container">
                    <div className="flex-item">
                        <label>Voornaam</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faUser} />
                            <input type="text" name="voornaam" placeholder="Voornaam" onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="flex-item">
                        <label>Achternaam</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faUser} />
                            <input type="text" name="achternaam" placeholder="Achternaam" onChange={handleChange} required />
                        </div>
                    </div>
                </div>
                <div className="flex-container">
                    <div className="flex-item">
                        <label>Geslacht</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faUser} />
                            <select name="geslacht" onChange={handleChange} required>
                                <option value="">Selecteer Geslacht</option>
                                <option value="man">Man</option>
                                <option value="vrouw">Vrouw</option>
                                <option value="anders">Anders</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex-item">
                        <label>Geboortedatum</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faCalendarAlt} style={{ zIndex: 999 }}/>
                            <DatePicker
                                selected={formData.geboortedatum}
                                onChange={handleDateChange}
                                dateFormat="dd/MM/yyyy"
                                maxDate={maxDate}
                                showYearDropdown
                                showMonthDropdown
                                dropdownMode="select"
                                placeholderText="dd/mm/yyyy"
                                className="date-picker"
                                required
                            />
                        </div>
                    </div>
                </div>
                <div className="flex-container">
                    <div className="flex-item">
                        <label>Email</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faEnvelope} />
                            <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="flex-item">
                        <label>Password</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faLock} />
                            <input 
                                type="password" 
                                name="password" 
                                placeholder="Password" 
                                onChange={handleChange} 
                                onFocus={handlePasswordFocus} 
                                onBlur={handlePasswordBlur} 
                                required 
                            />
                        </div>
                        {passwordStrength > 0 && (
                            <div className="progress password-strength-bar">
                                <div 
                                    className={`progress-bar ${passwordStrength >= 95 ? 'bg-success' : passwordStrength >= 50 ? 'bg-warning' : 'bg-danger'}`} 
                                    role="progressbar" 
                                    style={{ width: `${passwordStrength}%` }} 
                                    aria-valuenow={passwordStrength} 
                                    aria-valuemin="0" 
                                    aria-valuemax="100">
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {showPasswordTooltip && (
                    <div className="password-tooltip">
                        <p>Wachtwoord moet:</p>
                        <ul>
                            <li>Minimaal 8 tekens lang zijn</li>
                            <li>Minimaal 1 speciaal teken bevatten</li>
                            <li>Minimaal 1 hoofdletter bevatten</li>
                            <li>Minimaal 1 cijfer bevatten</li>
                        </ul>
                    </div>
                )}
                {passwordError && <p className="error">{passwordError}</p>}
                <div className="flex-container">
                    <div className="flex-item">
                        <label>Woonadres</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faHome} />
                            <input type="text" name="woonadres" placeholder="Woonadres" onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="flex-item">
                        <label>Telefoonnummer</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faPhone} />
                            <input type="number" name="telefoonnummer" placeholder="Telefoonnummer" onChange={handleChange} required />
                        </div>
                    </div>
                </div>
                <div className="flex-container">
                    <div className="flex-item">
                        <label>Voorkeur</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faGlobe} />
                            <input type="text" name="voorkeur" placeholder="Voorkeur" onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="flex-item">
                        <label>Straal km²</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faRuler} />
                            <input type="text" name="straal" placeholder="Straal" onChange={handleChange} required />
                        </div>
                    </div>
                </div>
                <div className="flex-container">
                    <div className="flex-item">
                        <label>Jaarinkomen</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faMoneyBill} />
                            <input type="text" name="jaarinkomen" placeholder="Jaarinkomen" onChange={handleChange} required />
                        </div>
                    </div>
                    <div className="flex-item">
                        <label>PDF van Jaaropgave</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faFilePdf} />
                            <input type="file" name="pdf" onChange={handleChange} required />
                        </div>
                    </div>
                </div>
                <div className="flex-container">
                    <div className="flex-item">
                        <label>Bewijsfoto van Bankgegevens</label>
                        <div className="input-icon">
                            <FontAwesomeIcon icon={faCamera} />
                            <input type="file" name="bewijsfoto" onChange={handleChange} required />
                        </div>
                    </div>
                </div>
                <div className="terms">
                    <input type="checkbox" id="terms" onChange={handleTermsChange} required />
                    <label htmlFor="terms"> Ik ga akkoord met de <a href="#" onClick={toggleTermsModal}>algemene voorwaarden</a></label>
                </div>
                <br></br>
                <button onClick={handleClick} type="submit">Register</button>
            </form>

            {showTerms && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={toggleTermsModal}>&times;</span>
                        <h2>Algemene Voorwaarden</h2>
                        <p>Een accounthouder kan zelf zijn account, profiel en persoonlijke gegevens verwijderen nadat het huurcontract is gestopt. Andere gegevens, zoals transactie- en huurgegevens, moeten echter worden bewaard, zelfs als de persoonlijke gegevens zijn verwijderd.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis egestas rhoncus. Donec facilisis fermentum sem, ac viverra ante luctus vel. Donec vel mauris quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis egestas rhoncus. Donec facilisis fermentum sem, ac viverra ante luctus vel. Donec vel mauris quam. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla convallis egestas rhoncus. Donec facilisis fermentum sem, ac viverra ante luctus vel. Donec vel mauris quam.</p>
                        <button type="button" onClick={toggleTermsModal}>Sluit</button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Register;
