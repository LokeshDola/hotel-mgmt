import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';

const API_BASE_URL = "http://localhost:8080/api";

function AdminDashboard({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/admin');
    } else {
      fetchCustomers();
    }
  }, [isAuthenticated, navigate]);

  const fetchCustomers = () => {
    fetch(`${API_BASE_URL}/customers`)
      .then(res => res.json())
      .then(data => setCustomers(data))
      .catch(err => console.error(err));
  };

  if (!isAuthenticated) return null;

  return (
    <div className="container">
      <div style={{marginTop: '2rem'}}>
        <h1 className="section-title" style={{marginBottom: 0}}>Manager Dashboard</h1>
      </div>

      <div className="table-wrapper" style={{marginTop: '2rem'}}>
        <h3 style={{padding: '1rem', borderBottom: '1px solid #eee'}}>Customer Database</h3>
        <table className="app-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Contact</th>
              <th>Room #</th>
              <th>Room Status</th>
              <th>Room Bill</th>
              <th>Food Bill</th>
              <th>Total Bill</th>
              <th>Bill Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.contact}</td>
                
                {/* Room Number */}
                <td style={{fontWeight: 'bold'}}>
                  {customer.roomNumber}
                </td>

                {/* Room Status (Occupied/Checked Out) */}
                <td>
                  <span className={customer.roomStatus === 'Occupied' ? 'status-booked' : 'status-available'}>
                    {customer.roomStatus}
                  </span>
                </td>

                {/* Room Bill */}
                <td style={{color: '#555'}}>₹{customer.roomBill.toFixed(2)}</td>

                {/* Food Bill */}
                <td style={{color: '#555'}}>₹{customer.foodBill.toFixed(2)}</td>
                
                {/* Total Bill */}
                <td style={{fontWeight: 'bold', color: '#2c3e50'}}>₹{customer.totalBill.toFixed(2)}</td>

                {/* Bill Status Badge */}
                <td>
                   <span style={{
                     padding: '4px 8px', 
                     borderRadius: '12px',
                     fontSize: '0.85rem',
                     fontWeight: '600',
                     backgroundColor: customer.billStatus === 'Pending' ? '#fff3cd' : '#d4edda',
                     color: customer.billStatus === 'Pending' ? '#856404' : '#155724'
                   }}>
                     {customer.billStatus}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDashboard;