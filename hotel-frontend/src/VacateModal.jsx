import React, { useState } from 'react';
import './App.css';

function VacateModal({ room, onClose, onVerify }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !contact) {
      setError("Please fill in both fields.");
      return;
    }
    // Pass details back to parent to send to API
    onVerify(room.roomNumber, name, contact);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Verify Checkout</h3>
        <p style={{textAlign: 'center', color: '#636e72', marginBottom: '1.5rem'}}>
          To vacate <strong>Room {room.roomNumber}</strong>, please verify customer identity.
        </p>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Customer Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter name used for booking"
              required 
            />
          </div>

          <div className="form-group">
            <label>Mobile Number</label>
            <input 
              type="tel" 
              value={contact} 
              onChange={(e) => setContact(e.target.value)} 
              placeholder="Enter registered mobile number"
              required 
            />
          </div>

          {error && <p className="error-text" style={{color: 'red', textAlign: 'center'}}>{error}</p>}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn btn-vacate">
              Verify & Vacate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default VacateModal;