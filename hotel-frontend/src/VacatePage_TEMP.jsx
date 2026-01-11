import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom'; // Import useLocation
import './App.css';

function VacatePage() {
  const { roomNumber } = useParams();
  const location = useLocation(); // Access passed state
  const [bill, setBill] = useState(null);

  useEffect(() => {
    // Check if bill data was passed from RoomPage
    if (location.state && location.state.bill) {
      setBill(location.state.bill);
    } else {
      // Fallback (or redirect error)
      console.error("No bill data found. Access denied.");
    }
  }, [location]);

  if (!bill) {
    return (
      <div className="container" style={{textAlign: 'center', marginTop: '4rem'}}>
        <h2>Loading Bill...</h2>
        <p>If this takes too long, please go back and verify your details again.</p>
        <Link to="/rooms" className="btn btn-cancel">Back to Rooms</Link>
      </div>
    );
  }

  // --- Helper to format Food Names ---
  const formatItemName = (name) => {
    return name.replace(/\(x\d+\)/g, '').trim(); 
  };

  return (
    <div className="container">
      <div className="bill-container fade-in">
        <div className="bill-header">
          <h1>Final Bill Invoice</h1>
          <p>Room {roomNumber}</p>
        </div>

        <div className="bill-details">
          {/* Room Charge */}
          <div className="bill-item">
            <span>Room Charge</span>
            <span>₹{bill.roomPrice.toFixed(2)}</span>
          </div>

          {/* Food Orders */}
          {bill.foodOrders && bill.foodOrders.length > 0 && (
            <div className="bill-section">
              <h4>Food & Dining</h4>
              {bill.foodOrders.map(item => (
                <div key={item.id} className="bill-item bill-food-item">
                  <span>{formatItemName(item.itemName)}</span>
                  <span>₹{item.itemPrice.toFixed(2)}</span>
                </div>
              ))}
              <div className="bill-item bill-food-total">
                <span>Food Total</span>
                <span>₹{bill.foodTotal.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Grand Total */}
          <div className="bill-grand-total">
            <strong>Grand Total</strong>
            <strong>₹{bill.grandTotal.toFixed(2)}</strong>
          </div>
        </div>

        <div className="bill-footer">
          <p className="success-message">✅ Payment Successful</p>
          <p>The room has been vacated and is now available.</p>
          
          <Link to="/rooms">
            <button className="btn btn-submit" style={{marginTop: '1rem'}}>
              Return to Room Status
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default VacatePage;