import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './App.css';

const API_BASE_URL = "https://hotel-mgmt-0uje.onrender.com/api";

function WelcomePage() {
  const [step, setStep] = useState('role'); 
  const [guestContact, setGuestContact] = useState("");
  const [activeBooking, setActiveBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  // --- 1. CLEANUP ON LOAD ---
  // Whenever user comes to Home, clear previous guest session
  useEffect(() => {
    localStorage.removeItem('activeGuestBooking');
  }, []);

  const handleManagerClick = () => navigate('/admin');

  const handleGuestClick = () => {
    setStep('guest-login');
  };

  const handleContactChange = (e) => {
    const value = e.target.value;
    const numericValue = value.replace(/[^0-9]/g, '');
    if (numericValue.length <= 10) {
      setGuestContact(numericValue);
    }
  };

  const handleGuestCheck = (e) => {
    e.preventDefault();
    if (guestContact.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsLoading(true);
    
    fetch(`${API_BASE_URL}/guest-check?contact=${guestContact}`)
      .then(res => res.json())
      .then(data => {
        if (data.hasBooking) {
          setActiveBooking(data);
          // --- 2. SAVE TO LOCAL STORAGE ---
          localStorage.setItem('activeGuestBooking', JSON.stringify(data));
        } else {
          setActiveBooking(null);
          // Also save that they are a guest but have no booking
          localStorage.setItem('activeGuestBooking', JSON.stringify({ hasBooking: false }));
        }
        setStep('services');
      })
      .catch(err => {
        alert("Connection Error. Please try again.");
      })
      .finally(() => setIsLoading(false));
  };

  const handleBack = () => {
    setStep('role');
    setGuestContact("");
    setActiveBooking(null);
    localStorage.removeItem('activeGuestBooking'); // Clear if they go back
  };

  return (
    <div className="welcome-container">
      <div className="welcome-logo-wrapper">
        <img 
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=300&q=80" 
          alt="Hotel Luxury" 
          className="welcome-real-logo"
        />
      </div>

      <h1 className="welcome-title">Grand Hotel & Suites</h1>
      <p className="welcome-subtitle">Experience luxury in the heart of the city.</p>
      
      {step === 'role' && (
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

      {step === 'guest-login' && (
        <div className="fade-in">
          <p className="selection-label">Please enter your 10-digit mobile number</p>
          <form onSubmit={handleGuestCheck} style={{maxWidth: '300px', margin: '0 auto'}}>
            <div className="form-group">
              <input 
                type="tel" 
                placeholder="Mobile Number" 
                value={guestContact}
                onChange={handleContactChange}
                maxLength="10" 
                required
                className="guest-input"
                style={{textAlign: 'center', fontSize: '1.2rem', letterSpacing: '2px'}}
              />
              <div style={{fontSize: '0.8rem', color: '#636e72', marginTop: '5px', textAlign: 'right'}}>
                {guestContact.length}/10
              </div>
            </div>
            <button 
              type="submit" 
              className="welcome-nav-btn btn-guest-role" 
              disabled={isLoading || guestContact.length !== 10}
              style={{
                width: '100%', 
                marginTop: '1rem', 
                opacity: guestContact.length === 10 ? 1 : 0.6,
                cursor: guestContact.length === 10 ? 'pointer' : 'not-allowed'
              }}
            >
              {isLoading ? 'Verifying...' : 'Continue'}
            </button>
          </form>
          <button onClick={handleBack} className="btn-back-link">← Back</button>
        </div>
      )}

      {step === 'services' && (
        <div className="guest-options fade-in">
          <p className="selection-label">
            {activeBooking 
              ? `Welcome back, ${activeBooking.customerName}.` 
              : "Welcome! How can we serve you today?"}
          </p>
          
          <div className="welcome-nav-buttons">
            {activeBooking ? (
              <Link to="/rooms" className="welcome-nav-btn btn-vacate-menu">
                 Vacate Room {activeBooking.roomNumber}
              </Link>
            ) : (
              <Link to="/rooms" className="welcome-nav-btn btn-rooms">
                Book a Room
              </Link>
            )}
            <Link to="/food" className="welcome-nav-btn btn-food">
              Dining & Room Service
            </Link>
          </div>
          <button onClick={handleBack} className="btn-back-link">← Exit</button>
        </div>
      )}
    </div>
  );
}

export default WelcomePage;