import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

function WelcomePage() {
  const [roleSelected, setRoleSelected] = useState(null); 
  const navigate = useNavigate();

  const handleManagerClick = () => navigate('/admin');
  const handleGuestClick = () => setRoleSelected('guest');

  return (
    <div className="welcome-container">
      
      {/* Realistic Logo Image */}
      <div className="welcome-logo-wrapper">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80" 
          alt="Hotel Luxury" 
          className="welcome-real-logo"
        />
      </div>

      <h1 className="welcome-title">Grand Hotel & Suites</h1>
      <p className="welcome-subtitle">Experience luxury in the heart of the city.</p>
      
      {/* --- ROLE SELECTION --- */}
      {!roleSelected && (
        <div className="role-selection fade-in">
          <p className="selection-label">Select your portal</p>
          
          <div className="welcome-nav-buttons">
            <button onClick={handleManagerClick} className="welcome-nav-btn btn-manager-role">
              Manager Login
            </button>
            <button onClick={handleGuestClick} className="welcome-nav-btn btn-guest-role">
              Guest Services
            </button>
          </div>
        </div>
      )}

      {/* --- GUEST OPTIONS --- */}
      {roleSelected === 'guest' && (
        <div className="guest-options fade-in">
          <p className="selection-label">Welcome, Guest. How can we serve you?</p>
          
          <div className="welcome-nav-buttons">
            <Link to="/rooms" className="welcome-nav-btn btn-rooms">
              Book a Room
            </Link>
            <Link to="/food" className="welcome-nav-btn btn-food">
              Dining & Room Service
            </Link>
          </div>

          <button onClick={() => setRoleSelected(null)} className="btn-back-link">
            ← Back to Selection
          </button>
        </div>
      )}
    </div>
  );
}

export default WelcomePage;