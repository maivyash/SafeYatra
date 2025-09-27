import React from "react";
import { Link } from "react-router-dom";
import { Shield, Users, AlertTriangle, FileText, MapPin, Bell } from "lucide-react";
import "./Demo.css";

const Demo = () => {
  return (
    <div className="demo-page">
      <div className="demo-container">
        <header className="demo-header">
          <Shield className="demo-icon" />
          <h1>Police Dashboard Demo</h1>
          <p>Comprehensive police control system for tourist safety monitoring</p>
        </header>

        <div className="demo-features">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <Users className="feature-icon" />
              <h3>Real-time Tourist Tracking</h3>
              <p>Monitor all tourists in your jurisdiction with live location updates, status tracking, and detailed profiles including emergency contacts.</p>
              <ul>
                <li>Live location tracking</li>
                <li>Tourist profiles & emergency contacts</li>
                <li>Status monitoring (active/inactive)</li>
                <li>Last seen timestamps</li>
              </ul>
            </div>

            <div className="feature-card">
              <AlertTriangle className="feature-icon" />
              <h3>SOS Alert Management</h3>
              <p>Receive instant notifications for SOS alerts with location details, priority levels, and assignment capabilities.</p>
              <ul>
                <li>Instant SOS notifications</li>
                <li>Priority-based alert system</li>
                <li>Officer assignment</li>
                <li>Response time tracking</li>
              </ul>
            </div>

            <div className="feature-card">
              <FileText className="feature-icon" />
              <h3>FIR Report Management</h3>
              <p>Digital FIR registration, case tracking, evidence management, and status updates for efficient case handling.</p>
              <ul>
                <li>Digital FIR registration</li>
                <li>Case status tracking</li>
                <li>Evidence management</li>
                <li>Officer assignment</li>
              </ul>
            </div>

            <div className="feature-card">
              <MapPin className="feature-icon" />
              <h3>Interactive Map View</h3>
              <p>Visual representation of tourists, police stations, SOS alerts, and safety zones with real-time updates.</p>
              <ul>
                <li>Tourist location markers</li>
                <li>Police station locations</li>
                <li>SOS alert indicators</li>
                <li>Safety zone overlays</li>
              </ul>
            </div>

            <div className="feature-card">
              <Bell className="feature-icon" />
              <h3>Notification System</h3>
              <p>Real-time notifications for all critical events with priority levels and read/unread status tracking.</p>
              <ul>
                <li>Real-time notifications</li>
                <li>Priority-based alerts</li>
                <li>Read/unread tracking</li>
                <li>Event categorization</li>
              </ul>
            </div>

            <div className="feature-card">
              <Shield className="feature-icon" />
              <h3>Safety Analytics</h3>
              <p>Comprehensive statistics and analytics for crime patterns, response times, and area safety scores.</p>
              <ul>
                <li>Crime statistics</li>
                <li>Response time analytics</li>
                <li>Area safety scores</li>
                <li>Trend analysis</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="demo-data">
          <h2>Demo Data Includes</h2>
          <div className="data-grid">
            <div className="data-item">
              <h4>8 Active Tourists</h4>
              <p>From different countries with complete profiles, locations, and emergency contacts</p>
            </div>
            <div className="data-item">
              <h4>3 SOS Alerts</h4>
              <p>Active and resolved alerts with different priority levels and response times</p>
            </div>
            <div className="data-item">
              <h4>5 FIR Reports</h4>
              <p>Various crime types including theft, fraud, harassment, assault, and lost property</p>
            </div>
            <div className="data-item">
              <h4>15 Police Stations</h4>
              <p>Covering all major areas of Pune with contact details and jurisdictions</p>
            </div>
            <div className="data-item">
              <h4>30+ Safety Areas</h4>
              <p>Polygon-based safety zones with crime statistics and safety scores</p>
            </div>
            <div className="data-item">
              <h4>Real-time Notifications</h4>
              <p>Live notification system with different event types and priority levels</p>
            </div>
          </div>
        </div>

        <div className="demo-actions">
          <Link to="/police-dashboard" className="demo-btn primary">
            <Shield size={20} />
            Launch Police Dashboard
          </Link>
          <Link to="/dashboard" className="demo-btn secondary">
            <Users size={20} />
            View Tourist Dashboard
          </Link>
        </div>

        <div className="demo-tech">
          <h2>Technology Stack</h2>
          <div className="tech-list">
            <span className="tech-item">React.js</span>
            <span className="tech-item">Leaflet Maps</span>
            <span className="tech-item">Socket.io</span>
            <span className="tech-item">Express.js</span>
            <span className="tech-item">MongoDB</span>
            <span className="tech-item">Real-time Updates</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;
