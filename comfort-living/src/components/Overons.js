import React, { useState } from 'react';
import TermsPopup from './TermsPopup';
import './Overons.css';

const Overons = () => {
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleAccept = () => {
    setTermsAccepted(true);
    setShowPopup(false);
  };

  return (
    <div className="overons">
      {!termsAccepted && (
        <div className="terms-bar">
          <p>By using this site, you accept our <a href="#" onClick={() => setShowPopup(true)}>terms and conditions</a>.</p>
        </div>
      )}
      {showPopup && (
        <TermsPopup onClose={() => setShowPopup(false)} onAccept={handleAccept} />
      )}
    </div>
  );
};

export default Overons;
