import React from 'react';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const goToHomePage = () => {
    navigate('/');
  };

  return (
    <div>
      <h1>Unauthorized</h1>
      <p>U heeft geen toestemming om deze pagina te bekijken.</p>
      <button onClick={goToHomePage}>Ga naar Home Pagina</button>
    </div>
  );
};

export default Unauthorized;
