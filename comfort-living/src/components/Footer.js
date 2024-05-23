import React from 'react';
import './Footer.css';

function Footer() {
  return (
    <div>
      <footer className="footer">
        <div className="customer-service">
          <h3>Klantenservice</h3>
          <a href="#">Contact</a>
          <a href="#">Veelgestelde vragen</a>
        </div>
        <div className="social-media">
          <h3>Volg ons</h3>
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">Twitter</a>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
