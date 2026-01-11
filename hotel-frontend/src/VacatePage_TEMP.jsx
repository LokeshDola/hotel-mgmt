import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './App.css'; // We'll reuse the bill styles

const API_BASE_URL = "http://localhost:8080/api";

function VacatePage() {
  const { roomNumber } = useParams(); // Get roomNumber from URL (e.g., "101")
  const navigate = useNavigate(); // Hook to redirect the user

  const [bill, setBill] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch the bill data when the page loads
  useEffect(() => {
    fetch(`${API_BASE_URL}/rooms/${roomNumber}/bill`)
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch bill');
        return response.json();
      })
      .then(billData => {
        setBill(billData);
        setError(null);
      })
      .catch(err => {
        setError("Error fetching bill: " + err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [roomNumber]); // Re-run if the roomNumber changes

  // 2. Handle the final "Confirm & Vacate" click
  const handleConfirmVacate = () => {
    fetch(`${API_BASE_URL}/rooms/${roomNumber}/vacate`, { method: 'PUT' })
      .then(response => {
        if (!response.ok) throw new Error('Vacating failed');
        return response.json();
      })
      .then(() => {
        // --- IMPORTANT ---
        // We must tell App.jsx to re-fetch rooms and orders.
        // We'll use localStorage.
        localStorage.setItem('refreshData', 'true');
        
        // Redirect back to the home page
        navigate('/'); 
      })
      .catch(err => setError("Error vacating: " + err.message));
  };

  // 3. Handle the "Cancel" click
  const handleCancel = () => {
    navigate('/'); // Go back to the home page
  };

  // --- Render logic ---
  if (isLoading) {
    return <p className="loading-text">Loading bill for Room {roomNumber}...</p>;
  }
  
  // Note: We show the page-level error *and* the vacate error
  if (error) {
    return (
      <div className="bill-container">
        <div className="error-box">{error}</div>
        <div className="modal-actions" style={{ justifyContent: 'center' }}>
          <button type="button" onClick={handleCancel} className="btn btn-cancel">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!bill) {
    return <p className="loading-text">No bill data found.</p>;
  }

  // Helper to format item name
  const formatItemName = (name) => {
    return name.length > 50 ? name.substring(0, 50) + '...' : name;
  };

  return (
    <div className="bill-container">
      <h3>Final Bill for Room {roomNumber}</h3>
      
      <div className="bill-section">
        <div className="bill-item">
          <span>Room Charge</span>
          <span>₹ {bill.roomPrice.toFixed(2)}</span>
        </div>
      </div>

      <div className="bill-section">
        <strong>Food Orders</strong>
        {bill.foodItems.length > 0 ? (
          bill.foodItems.map(item => (
            <div key={item.id} className="bill-item bill-food-item">
              <span>{formatItemName(item.itemName)}</span>
              <span>₹ {item.itemPrice.toFixed(2)}</span>
            </div>
          ))
        ) : (
          <p className="bill-no-food">No food orders for this room.</p>
        )}
        <div className="bill-item bill-food-total">
          <span>Food Total</span>
          <span>₹{bill.foodTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="bill-grand-total">
        <strong>Grand Total</strong>
        <strong>₹{bill.grandTotal.toFixed(2)}</strong>
      </div>
      
      <div className="modal-actions">
        <button type="button" onClick={handleCancel} className="btn btn-cancel">
          Cancel
        </button>
        <button type="button" onClick={handleConfirmVacate} className="btn btn-submit">
          Confirm & Vacate
        </button>
      </div>
    </div>
  );
}

export default VacatePage;