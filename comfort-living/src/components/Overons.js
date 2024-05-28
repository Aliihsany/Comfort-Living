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
          <p>als je doorgaat op deze site dan accepteer je onze<a href="#" onClick={() => setShowPopup(true)}>terms en condities</a>.</p>
        </div>
      )}
      {showPopup && (
        <TermsPopup onClose={() => setShowPopup(false)} onAccept={handleAccept} />
      )}
    </div>
  );
};

export default Overons;
