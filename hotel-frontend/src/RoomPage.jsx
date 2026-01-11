import React from 'react';
import { useNavigate } from 'react-router-dom'; // <-- ADD THIS

// onVacate prop is GONE
function RoomPage({ rooms, onBook }) {
  return (
    <div className="room-status-column">
      <h2 className="section-title">Room Status</h2>
      <RoomTable
        rooms={rooms}
        onBook={onBook}
        // onVacate prop is GONE
      />
    </div>
  );
}

// --- RoomTable Component ---
// onVacate prop is GONE
function RoomTable({ rooms, onBook }) {
  return (
    <div className="table-wrapper">
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
          {rooms.map(room => (
            <RoomRow 
              key={room.id} 
              room={room} 
              onBook={onBook}
              // onVacate prop is GONE
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

// --- RoomRow Component ---
// onVacate prop is GONE
function RoomRow({ room, onBook }) {
  const isBooked = room.booked;
  const navigate = useNavigate(); // <-- ADD THIS

  // NEW click handler for the vacate button
  const handleVacateClick = () => {
    navigate(`/room/${room.roomNumber}/vacate`);
  };

  return (
    <tr>
      <td>{room.roomNumber}</td>
      <td className="room-type">{room.roomType}</td>
      <td>
        {isBooked ? (
          <span className="status-booked">Booked</span>
        ) : (
          <span className="status-available">Available</span>
        )}
      </td>
      <td>{isBooked ? room.customerName : '---'}</td>
      <td>₹{room.price.toFixed(2)}</td>
      <td>
        {isBooked ? (
          <button
            onClick={handleVacateClick} // <-- USE NEW HANDLER
            className="action-button btn-vacate"
          >
            Vacate
          </button>
        ) : (
          <button
            onClick={() => onBook(room)}
            className="action-button btn-book"
          >
            Book Now
          </button>
        )}
      </td>
    </tr>
  );
}

export default RoomPage;