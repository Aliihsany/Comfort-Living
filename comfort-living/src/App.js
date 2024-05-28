import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Homepage from './components/Homepage';
import Login from './components/Login';
import RegisterPage from './components/register';
import VerifyEmail from './components/VerifyEmail';
import PrivateRoute from './components/PrivateRoute';
import AdminPage from './admin/Adminpage';
import WoningToevoegen from './admin/Woningtoevoegen';
import Woningen from './admin/Woningen';
import Woninginfo from './components/Woninginfo';
import Woningdetail from './admin/Woningdetail'; 
import Userpage from './admin/Userpage';
import Blocked from './components/Blocked';
import Profile from './components/Profile';
import Over from './components/Overons';
import Compare from './components/Compare';
import Unauthorized from './components/Unauthorized';
import WoningenBewerken from './admin/WoningenBewerken';


import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/blocked" element={<Blocked />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route 
            path="/" 
            element={
              <PrivateRoute>
                <Homepage />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Homepage />} />
          <Route 
            path="/admin" 
            element={
              <PrivateRoute requiredRole="admin">
                <AdminPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/woningtoevoegen" 
            element={
              <PrivateRoute requiredRole="admin">
                <WoningToevoegen />
              </PrivateRoute>
            } 
          />
          <Route path="/woning/:id" element={<Woninginfo />} /> 
          <Route 
            path="/woningdetail/:id" 
            element={
              <PrivateRoute requiredRole="admin">
                <Woningdetail />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/woningen" 
            element={
              <PrivateRoute requiredRole="admin">
                <Woningen />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/userpage" 
            element={
              <PrivateRoute requiredRole="admin">
                <Userpage />
              </PrivateRoute>
            } 
          />
          <Route path="/over" element={<Over />} />
          <Route path="/compare/:id" element={<Compare />} />
          <Route path="/profile" element={<Profile />} />
          <Route exact path="/woningen/:id/bewerken" element={<WoningenBewerken />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
