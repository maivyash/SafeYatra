import React, { useState, useEffect, useRef } from "react";
import "./PoliceDashboard.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polygon,
  Tooltip,
  CircleMarker,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from "socket.io-client";
import {
  Users,
  AlertTriangle,
  FileText,
  Bell,
  MapPin,
  Shield,
  Activity,
  Eye,
  Phone,
  Clock,
  Search,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

// Custom icons with better styling
const touristIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#3b82f6" stroke="#ffffff" stroke-width="2"/>
      <circle cx="16" cy="12" r="4" fill="#ffffff"/>
      <path d="M8 24c0-4 3.5-8 8-8s8 4 8 8" fill="#ffffff"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

const sosIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
      <circle cx="18" cy="18" r="16" fill="#ef4444" stroke="#ffffff" stroke-width="2"/>
      <text x="18" y="24" text-anchor="middle" fill="#ffffff" font-family="Arial" font-size="16" font-weight="bold">SOS</text>
    </svg>
  `),
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -18]
});

const policeIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="14" fill="#1f2937" stroke="#ffffff" stroke-width="2"/>
      <path d="M12 8h8l2 4v8h-2v4h-8v-4h-2v-8l2-4z" fill="#ffffff"/>
      <circle cx="16" cy="16" r="2" fill="#1f2937"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16]
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const PoliceDashboard = () => {
  const [tourists, setTourists] = useState([]);
  const [sosAlerts, setSosAlerts] = useState([]);
  const [firReports, setFirReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [policeStations, setPoliceStations] = useState([]);
  const [areas, setAreas] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedTourist, setSelectedTourist] = useState(null);
  const [selectedFir, setSelectedFir] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(API_BASE, { transports: ["websocket"] });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to police dashboard socket");
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from police dashboard socket");
      setIsConnected(false);
    });

    newSocket.on("newSOSAlert", (alert) => {
      setSosAlerts(prev => [alert, ...prev]);
      setNotifications(prev => [{
        id: Date.now(),
        type: "sos",
        title: "New SOS Alert",
        message: `SOS from ${alert.touristName} at ${alert.location}`,
        timestamp: new Date(),
        unread: true
      }, ...prev]);
    });

    newSocket.on("touristLocationUpdate", (tourist) => {
      setTourists(prev => prev.map(t => t.id === tourist.id ? tourist : t));
    });

    newSocket.on("newFIRReport", (fir) => {
      setFirReports(prev => [fir, ...prev]);
      setNotifications(prev => [{
        id: Date.now(),
        type: "fir",
        title: "New FIR Report",
        message: `FIR #${fir.firNumber} registered for ${fir.crimeType}`,
        timestamp: new Date(),
        unread: true
      }, ...prev]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  // Load initial data
  useEffect(() => {
    loadPoliceData();
  }, []);

  const loadPoliceData = async () => {
    try {
      // Load tourists
      const touristsRes = await fetch(`${API_BASE}/api/police/tourists`);
      const touristsData = await touristsRes.json();
      if (touristsData.success) setTourists(touristsData.tourists);

      // Load SOS alerts
      const sosRes = await fetch(`${API_BASE}/api/police/sos-alerts`);
      const sosData = await sosRes.json();
      if (sosData.success) setSosAlerts(sosData.alerts);

      // Load FIR reports
      const firRes = await fetch(`${API_BASE}/api/police/fir-reports`);
      const firData = await firRes.json();
      if (firData.success) setFirReports(firData.reports);

      // Load police stations
      const stationsRes = await fetch(`${API_BASE}/api/location/police-stations`);
      const stationsData = await stationsRes.json();
      if (stationsData.success) setPoliceStations(stationsData.stations);

      // Load areas
      const areasRes = await fetch(`${API_BASE}/api/location/areas`);
      const areasData = await areasRes.json();
      if (areasData.success) setAreas(areasData.areas);

    } catch (error) {
      console.error("Error loading police data:", error);
    }
  };

  const handleTouristClick = (tourist) => {
    setSelectedTourist(tourist);
    if (map) {
      map.flyTo([tourist.lat, tourist.lng], 16);
    }
  };

  const handleFirClick = (fir) => {
    setSelectedFir(fir);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, unread: false } : notif
      )
    );
  };

  const filteredTourists = tourists.filter(tourist => {
    const matchesSearch = tourist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          tourist.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || tourist.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const filteredFirReports = firReports.filter(fir => {
    const matchesSearch = fir.firNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fir.crimeType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          fir.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || fir.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const unreadNotifications = notifications.filter(n => n.unread).length;

  return (
    <div className="police-dashboard">
      {/* Header */}
      <header className="police-header">
        <div className="header-left">
          <Shield className="header-icon" />
          <div>
            <h1>Police Control Dashboard</h1>
            <p>Real-time monitoring and management system</p>
          </div>
        </div>
        <div className="header-right">
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            <div className="status-dot"></div>
            <span>{isConnected ? 'Connected' : 'Disconnected'}</span>
          </div>
          <button className="refresh-btn" onClick={loadPoliceData}>
            <RefreshCw size={20} />
            Refresh
          </button>
        </div>
      </header>

      {/* Stats Overview */}
      <section className="stats-overview">
        <div className="stat-card">
          <Users className="stat-icon" />
          <div className="stat-content">
            <h3>{tourists.length}</h3>
            <p>Active Tourists</p>
          </div>
        </div>
        <div className="stat-card alert">
          <AlertTriangle className="stat-icon" />
          <div className="stat-content">
            <h3>{sosAlerts.filter(alert => alert.status === 'active').length}</h3>
            <p>Active SOS Alerts</p>
          </div>
        </div>
        <div className="stat-card">
          <FileText className="stat-icon" />
          <div className="stat-content">
            <h3>{firReports.length}</h3>
            <p>FIR Reports</p>
          </div>
        </div>
        <div className="stat-card notification">
          <Bell className="stat-icon" />
          <div className="stat-content">
            <h3>{unreadNotifications}</h3>
            <p>Unread Notifications</p>
          </div>
        </div>
      </section>

      <div className="dashboard-content">
        {/* Left Panel - Lists */}
        <div className="left-panel">
          {/* Search and Filter */}
          <div className="search-filter">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search tourists, FIR reports..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="resolved">Resolved</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          {/* Tourists List */}
          <div className="list-section">
            <h3>
              <Users size={20} />
              Tourists ({filteredTourists.length})
            </h3>
            <div className="list-container">
              {filteredTourists.map((tourist) => (
                <div
                  key={tourist.id}
                  className={`list-item ${selectedTourist?.id === tourist.id ? 'selected' : ''}`}
                  onClick={() => handleTouristClick(tourist)}
                >
                  <div className="item-avatar">
                    <img src={tourist.avatar} alt={tourist.name} />
                  </div>
                  <div className="item-content">
                    <h4>{tourist.name}</h4>
                    <p className="item-location">
                      <MapPin size={14} />
                      {tourist.location}
                    </p>
                    <div className="item-meta">
                      <span className={`status-badge ${tourist.status}`}>
                        {tourist.status}
                      </span>
                      <span className="last-seen">
                        <Clock size={12} />
                        {tourist.lastSeen}
                      </span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button className="action-btn">
                      <Phone size={16} />
                    </button>
                    <button className="action-btn">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FIR Reports List */}
          <div className="list-section">
            <h3>
              <FileText size={20} />
              FIR Reports ({filteredFirReports.length})
            </h3>
            <div className="list-container">
              {filteredFirReports.map((fir) => (
                <div
                  key={fir.id}
                  className={`list-item ${selectedFir?.id === fir.id ? 'selected' : ''}`}
                  onClick={() => handleFirClick(fir)}
                >
                  <div className="item-content">
                    <h4>FIR #{fir.firNumber}</h4>
                    <p className="item-location">
                      <MapPin size={14} />
                      {fir.location}
                    </p>
                    <div className="item-meta">
                      <span className="crime-type">{fir.crimeType}</span>
                      <span className={`status-badge ${fir.status}`}>
                        {fir.status}
                      </span>
                    </div>
                    <div className="item-details">
                      <span>Reporter: {fir.reporterName}</span>
                      <span>Date: {fir.date}</span>
                    </div>
                  </div>
                  <div className="item-actions">
                    <button className="action-btn">
                      <Eye size={16} />
                    </button>
                    <button className="action-btn">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Map and Details */}
        <div className="right-panel">
          {/* Map */}
          <div className="map-section">
            <div className="map-header">
              <h3>
                <MapPin size={20} />
                Live Map View
              </h3>
              <div className="map-controls">
                <button 
                  className="map-control-btn"
                  onClick={() => map && map.setView([18.5204, 73.8567], 12)}
                  title="Reset View"
                >
                  <RefreshCw size={16} />
                </button>
                <button 
                  className="map-control-btn"
                  onClick={() => map && map.zoomIn()}
                  title="Zoom In"
                >
                  +
                </button>
                <button 
                  className="map-control-btn"
                  onClick={() => map && map.zoomOut()}
                  title="Zoom Out"
                >
                  -
                </button>
              </div>
            </div>
            <div className="map-container">
              <MapContainer
                center={[18.5204, 73.8567]} // Pune coordinates
                zoom={12}
                style={{ height: "600px", width: "100%" }}
                whenCreated={(m) => setMap(m)}
                zoomControl={false}
              >
                <TileLayer 
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                {/* Police Stations */}
                {policeStations.map((station, index) => (
                  <Marker
                    key={index}
                    position={[station.lat, station.lng]}
                    icon={policeIcon}
                  >
                    <Popup>
                      <h3>{station.name}</h3>
                      <p><b>Address:</b> {station.address}</p>
                      <p><b>Contact:</b> {station.phone}</p>
                      <p><b>Division:</b> {station.division}</p>
                    </Popup>
                  </Marker>
                ))}

                {/* Tourists */}
                {tourists.map((tourist) => (
                  <Marker
                    key={tourist.id}
                    position={[tourist.lat, tourist.lng]}
                    icon={touristIcon}
                  >
                    <Popup>
                      <h3>{tourist.name}</h3>
                      <p><b>Status:</b> {tourist.status}</p>
                      <p><b>Location:</b> {tourist.location}</p>
                      <p><b>Last Seen:</b> {tourist.lastSeen}</p>
                      <p><b>Phone:</b> {tourist.phone}</p>
                    </Popup>
                  </Marker>
                ))}

                {/* SOS Alerts */}
                {sosAlerts.filter(alert => alert.status === 'active').map((alert) => (
                  <Marker
                    key={alert.id}
                    position={[alert.lat, alert.lng]}
                    icon={sosIcon}
                  >
                    <Popup>
                      <h3>🚨 SOS Alert</h3>
                      <p><b>Tourist:</b> {alert.touristName}</p>
                      <p><b>Location:</b> {alert.location}</p>
                      <p><b>Time:</b> {alert.timestamp}</p>
                      <p><b>Message:</b> {alert.message}</p>
                    </Popup>
                  </Marker>
                ))}

                {/* Safety Areas */}
                {areas.map((area, idx) => {
                  const coords = (area.polygon_coords || []).map((c) => [c[0], c[1]]);
                  if (coords.length >= 3) {
                    return (
                      <Polygon
                        key={area.area_id || idx}
                        positions={coords}
                        pathOptions={{
                          color: area.safety_score >= 70 ? "#16a34a" : area.safety_score >= 50 ? "#f59e0b" : "#ef4444",
                          weight: 2,
                          fillOpacity: 0.1,
                        }}
                      >
                        <Tooltip direction="center" permanent={false}>
                          <div style={{ fontSize: 12, lineHeight: 1.1 }}>
                            <strong>{area.area_name || "Area"}</strong>
                            <br />
                            Safety: {area.safety_score ?? "N/A"}/100
                            <br />
                            Crime: {area.crime_count ?? "N/A"}
                          </div>
                        </Tooltip>
                      </Polygon>
                    );
                  }
                  return null;
                })}
              </MapContainer>
            </div>
          </div>

          {/* Notifications */}
          <div className="notifications-section">
            <h3>
              <Bell size={20} />
              Recent Notifications ({unreadNotifications})
            </h3>
            <div className="notifications-container">
              {notifications.slice(0, 5).map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${notification.unread ? 'unread' : ''}`}
                  onClick={() => markNotificationAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {notification.type === 'sos' ? (
                      <AlertTriangle size={16} />
                    ) : (
                      <FileText size={16} />
                    )}
                  </div>
                  <div className="notification-content">
                    <h4>{notification.title}</h4>
                    <p>{notification.message}</p>
                    <span className="notification-time">
                      {notification.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Detail Modals */}
      {selectedTourist && (
        <div className="modal-overlay" onClick={() => setSelectedTourist(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Tourist Details</h2>
              <button onClick={() => setSelectedTourist(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="tourist-details">
                <img src={selectedTourist.avatar} alt={selectedTourist.name} className="tourist-avatar" />
                <h3>{selectedTourist.name}</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${selectedTourist.status}`}>
                      {selectedTourist.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{selectedTourist.location}</span>
                  </div>
                  <div className="detail-item">
                    <label>Phone:</label>
                    <span>{selectedTourist.phone}</span>
                  </div>
                  <div className="detail-item">
                    <label>Last Seen:</label>
                    <span>{selectedTourist.lastSeen}</span>
                  </div>
                  <div className="detail-item">
                    <label>Emergency Contact:</label>
                    <span>{selectedTourist.emergencyContact}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedFir && (
        <div className="modal-overlay" onClick={() => setSelectedFir(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>FIR Report Details</h2>
              <button onClick={() => setSelectedFir(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="fir-details">
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>FIR Number:</label>
                    <span>{selectedFir.firNumber}</span>
                  </div>
                  <div className="detail-item">
                    <label>Crime Type:</label>
                    <span>{selectedFir.crimeType}</span>
                  </div>
                  <div className="detail-item">
                    <label>Location:</label>
                    <span>{selectedFir.location}</span>
                  </div>
                  <div className="detail-item">
                    <label>Reporter:</label>
                    <span>{selectedFir.reporterName}</span>
                  </div>
                  <div className="detail-item">
                    <label>Date:</label>
                    <span>{selectedFir.date}</span>
                  </div>
                  <div className="detail-item">
                    <label>Status:</label>
                    <span className={`status-badge ${selectedFir.status}`}>
                      {selectedFir.status}
                    </span>
                  </div>
                </div>
                <div className="detail-item full-width">
                  <label>Description:</label>
                  <p>{selectedFir.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PoliceDashboard;
