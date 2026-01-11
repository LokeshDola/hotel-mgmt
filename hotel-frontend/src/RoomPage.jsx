import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import VacateModal from './VacateModal'; // Import the new modal
import './App.css';

const API_BASE_URL = "http://localhost:8080/api";

function RoomPage({ rooms, onBook, isAuthenticated }) {
  const navigate = useNavigate();
  const [selectedRoomForVacate, setSelectedRoomForVacate] = useState(null);

  // Sort rooms
  const sortedRooms = [...rooms].sort((a, b) => a.roomNumber - b.roomNumber);

  // Handle Vacate Click - Open Modal
  const handleVacateClick = (room) => {
    setSelectedRoomForVacate(room);
  };

  // Handle Verification Submit
  const handleVerifyAndVacate = (roomNumber, name, contact) => {
    // API Call to Verify and Vacate
    fetch(`${API_BASE_URL}/rooms/${roomNumber}/vacate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerName: name, customerContact: contact })
    })
    .then(async (res) => {
      if (res.ok) {
        // Success! Get bill data and navigate to bill page
        const billData = await res.json();
        // We pass the bill data via state to the next page
        navigate(`/room/${roomNumber}/vacate`, { state: { bill: billData } }); 
      } else {
        // Failure - Show alert
        const errorMsg = await res.text();
        alert(errorMsg);
      }
    })
    .catch(err => alert("Network Error: " + err.message));
  };

  return (
    <div className="container"> 
      <div className="table-wrapper">
        <h3 style={{padding: '1rem', borderBottom: '1px solid #eee', margin: 0}}>Room Status</h3>
        <table className="app-table">
          <thead>
            <tr>
              <th>Room #</th>
              <th>Type</th>
              <th>Status</th>
              <th>Customer</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedRooms.map(room => (
              <RoomRow 
                key={room.id} 
                room={room} 
                onBook={onBook} 
                isAuthenticated={isAuthenticated}
                onVacateClick={() => handleVacateClick(room)} // Pass handler
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Render Vacate Verification Modal */}
      {selectedRoomForVacate && (
        <VacateModal 
          room={selectedRoomForVacate} 
          onClose={() => setSelectedRoomForVacate(null)}
          onVerify={handleVerifyAndVacate}
        />
      )}
    </div>
  );
}

function RoomRow({ room, onBook, isAuthenticated, onVacateClick }) {
  const isBooked = room.booked;

  return (
    <tr>
      <td style={{fontWeight: '600'}}>{room.roomNumber}</td>
      <td>{room.roomType}</td>
      <td>
        <span className={isBooked ? 'status-booked' : 'status-available'}>
          {isBooked ? 'Booked' : 'Available'}
        </span>
      </td>
      
      <td style={{color: '#636e72', fontStyle: isBooked ? 'normal' : 'italic'}}>
        {isBooked 
          ? (isAuthenticated ? room.customerName : 'Occupied') 
          : '---'}
      </td>

      <td>₹{room.price.toFixed(2)}</td>
      <td>
        {isBooked ? (
          // Change Link to Button to open Modal
          <button 
            className="action-button btn-vacate"
            onClick={onVacateClick}
          >
            Vacate
          </button>
        ) : (
          <button 
            className="action-button btn-book" 
            onClick={() => onBook(room)}
          >
            Book Now
          </button>
        )}
      </td>
    </tr>
  );
}

export default RoomPage;