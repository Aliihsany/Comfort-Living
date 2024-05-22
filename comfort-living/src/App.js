import React from 'react';
import Homepage from './components/Homepage'

const App = () => {
  return (
    <div className="App">
 
 <header>
      <div className="logo">Logo van website</div>
      <nav>
        <a href="#">Ik huur</a>
        <a href="#">Ik zoek</a>
        <a href="#">Organisatie</a>
        <a href="#">Contact</a>
        <input type="text" placeholder="Search" />
        <a href="#">Inloggen</a>
      </nav>
    </header>


      <Homepage />

      <footer>
      <div className="customer-service">
        <a href="#">Contact</a>
        <a href="#">Veelgestelde vragen</a>
      </div>
      <div className="social-media">
        <a href="#">Facebook</a>
        <a href="#">Instagram</a>
        <a href="#">Twitter</a>
      </div>
    </footer>
    </div>
    
  );
};

export default App;
