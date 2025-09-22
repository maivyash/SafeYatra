import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <div className="container">
        <h1>Welcome to Your Dashboard</h1>
        <div className="dashboard-content">
          <div className="user-info">
            <h2>Hello, {user?.name}!</h2>
            <p>Email: {user?.email}</p>
          </div>
          
          <div style={{ marginTop: '30px' }}>
            <h3 style={{ color: '#333', marginBottom: '20px' }}>Your Account</h3>
            <p style={{ color: '#666', lineHeight: '1.6' }}>
              You have successfully logged into your MERN stack application! 
              This is a protected route that only authenticated users can access.
            </p>
            
            <div style={{ marginTop: '30px', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <h4 style={{ color: '#333', marginBottom: '15px' }}>Next Steps:</h4>
              <ul style={{ color: '#666', lineHeight: '1.8' }}>
                <li>Implement additional API endpoints</li>
                <li>Add user profile management</li>
                <li>Create more protected routes</li>
                <li>Add data management features</li>
                <li>Implement real-time features</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
