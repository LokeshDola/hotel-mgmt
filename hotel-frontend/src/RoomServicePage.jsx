import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const API_BASE_URL = "https://hotel-mgmt-0uje.onrender.com/api";

function RoomServicePage() {
    const [roomNumber, setRoomNumber] = useState('');
    const [serviceType, setServiceType] = useState('Cleaning');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${API_BASE_URL}/room-service/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roomNumber, serviceType })
        })
        .then(res => res.json())
        .then(() => alert("Request sent successfully!"))
        .catch(() => alert("Connection Error. Please try again."));
    };

    return (
        <div className="welcome-container fade-in">
            <h1 className="welcome-title">Room Service & Decoration</h1>
            <form onSubmit={handleSubmit} style={{maxWidth: '300px', margin: '0 auto'}}>
                <div className="form-group">
                    <input 
                        type="text" 
                        placeholder="Room Number" 
                        value={roomNumber}
                        onChange={e => setRoomNumber(e.target.value)}
                        required
                        className="guest-input"
                        style={{textAlign: 'center', fontSize: '1.2rem', marginBottom: '1rem'}}
                    />
                </div>
                <div className="form-group">
                    <select 
                        value={serviceType} 
                        onChange={e => setServiceType(e.target.value)}
                        className="guest-input"
                        style={{textAlign: 'center', fontSize: '1.2rem', marginBottom: '1rem', width: '100%'}}
                    >
                        <option value="Cleaning">Room Cleaning</option>
                        <option value="Decoration">Room Decoration</option>
                    </select>
                </div>
                <button type="submit" className="welcome-nav-btn btn-guest-role" style={{width: '100%'}}>
                    Submit Request
                </button>
            </form>
            <button onClick={() => navigate('/')} className="btn-back-link" style={{marginTop: '2rem'}}>← Back to Home</button>
        </div>
    );
}

export default RoomServicePage;