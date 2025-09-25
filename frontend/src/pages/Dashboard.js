import React, { useState, useEffect, useRef } from "react";
import "./Dashboard.css";
import { useAuth } from "../contexts/AuthContext";
import {
  MapPin,
  AlertTriangle,
  ShieldCheck,
  Share2,
  User,
  BookOpen,
  Activity,
  Crosshair,
  Shield,
  LocateFixed,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import io from "socket.io-client";
import { Link } from "react-router-dom";

// Fix Leaflet default marker issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const SOCKET_SERVER_URL = API_BASE;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const socketRef = useRef();
  const [map, setMap] = useState(null);
  const [locationName, setLocationName] = useState("Getting location...");
  const [safetyScore, setSafetyScore] = useState(null);

  // Function to recenter map to live location
  const handleRecenter = () => {
    if (map && currentLocation) {
      map.flyTo(currentLocation, 16, { animate: true });
    }
  };

  useEffect(() => {
    // fetch static safety score from backend
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/data/safety-score`);
        const json = await res.json();
        if (json?.success) setSafetyScore(json.score);
        else setSafetyScore(85);
      } catch (e) {
        setSafetyScore(85);
      }
    })();
  }, []);

  // Throttle reverse-geocode calls
  const lastGeocodeAt = useRef(0);
  const geocodeThrottleMs = 10000; // 10s

  const fetchLocationName = async (lat, lng) => {
    try {
      const res = await fetch(`${API_BASE}/api/data/reverse-geocode`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lat, lng }),
      });
      if (!res.ok) throw new Error("Reverse geocode failed");
      const json = await res.json();
      if (json?.success && json.locationName)
        setLocationName(json.locationName);
      else setLocationName("Unknown location");
    } catch (err) {
      console.error("reverse-geocode error:", err);
      setLocationName("Could not fetch location");
    }
  };

  useEffect(() => {
    // --- WebSocket Connection ---
    socketRef.current = io(SOCKET_SERVER_URL);

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to socket server");
    });

    socketRef.current.on("nearbyUsersUpdate", (users) => {
      setNearbyUsers(users);
    });

    // --- Geolocation ---
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newLocation = { lat: latitude, lng: longitude };
        setCurrentLocation(newLocation);

        // Reverse-geocode (throttled)
        const now = Date.now();
        if (now - lastGeocodeAt.current > geocodeThrottleMs) {
          lastGeocodeAt.current = now;
          fetchLocationName(latitude, longitude);
        }

        // Send location update to the server
        if (user && socketRef.current && socketRef.current.connected) {
          socketRef.current.emit("updateLocation", {
            userId: user._id,
            name: user.name,
            location: newLocation,
          });
        }
      },
      (error) => console.error("❌ Geolocation error:", error),
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, [user]);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h1 className="logo">WanderSafe</h1>
      </header>

      {/* Welcome Section */}
      <div className="welcome-section">
        <img
          src="https://i.pravatar.cc/100"
          alt="avatar"
          className="welcome-avatar"
        />
        <div className="welcome-text">
          <h2>Welcome, {user?.name || "Sarah"}</h2>
          <p>Digital Tourist ID: Valid until Dec 31, 2024</p>
        </div>
      </div>

      {/* Current Safety Status */}
      <h3 className="section-title">Current Safety Status</h3>
      <div className="status-grid">
        <div className="status-card">
          <p>Safety Score</p>
          <div className="safety-score">
            <h3>{safetyScore ?? "–"}/100</h3>
            <span>+5%</span>
          </div>
        </div>
        <div className="status-card">
          <p>Location</p>
          <h3 className="location-text">
            <MapPin size={20} /> {locationName}
          </h3>
        </div>
      </div>

      {/* Map */}
      <h3 className="section-title">Live Map</h3>
      <div className="map-container">
        {currentLocation ? (
          <MapContainer
            center={currentLocation}
            zoom={15}
            style={{ height: "400px", width: "100%" }}
            ref={setMap}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />

            {/* My Location Marker */}
            <Marker position={currentLocation}>
              <Popup>You are here</Popup>
            </Marker>

            {/* Nearby Users Markers */}
            {nearbyUsers
              .filter((nearbyUser) => nearbyUser.userId !== user?._id)
              .map((nearbyUser) => (
                <Marker
                  key={nearbyUser.userId}
                  position={nearbyUser.location}
                  icon={L.icon({
                    iconUrl: "https://i.pravatar.cc/30?u=" + nearbyUser.userId,
                    iconSize: [30, 30],
                    className: "nearby-user-marker",
                  })}
                >
                  <Popup>
                    <div>
                      <strong>{nearbyUser.name}</strong>
                      <div>{(nearbyUser.distanceKm ?? "").toString()} km</div>
                    </div>
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        ) : (
          <div className="map-loading">Getting your location...</div>
        )}
      </div>

      {/* Recenter Button */}
      <div className="recenter-btn-wrapper">
        <button className="recenter-btn" onClick={handleRecenter}>
          <LocateFixed size={18} /> Recenter
        </button>
      </div>

      {/* Quick Actions */}
      <div className="actions-grid">
        <Link to="/sos" className="action-link">
          <button className="action-btn btn-sos">
            <AlertTriangle size={20} />
            SOS
          </button>
        </Link>

        <Link to="/share-live" className="action-link">
          <button className="action-btn btn-blue">
            <Share2 size={20} />
            Share Live
          </button>
        </Link>

        <Link to="/view-id" className="action-link">
          <button className="action-btn btn-blue">
            <User size={20} />
            View ID
          </button>
        </Link>

        <Link to="/itinerary" className="action-link">
          <button className="action-btn btn-blue">
            <BookOpen size={20} />
            Itinerary
          </button>
        </Link>
      </div>
      <h3 className="section-title">Real-time Alerts & Safety Tips</h3>
      <div className="alerts">
        <div className="alert-item alert-yellow">
          <div className="alert-icon-wrapper">
            <Shield size={20} />
          </div>
          <div>
            <p>Safety Tip: Avoid walking alone at night</p>
            <small>Stay aware of your surroundings</small>
          </div>
        </div>

        <div className="alert-item alert-red">
          <div className="alert-icon-wrapper">
            <AlertTriangle size={20} />
          </div>
          <div>
            <p>Alert: High crime rate in the Mission District</p>
            <small>Moderate risk area</small>
          </div>
        </div>

        <div className="alert-item alert-green">
          <div className="alert-icon-wrapper">
            <ShieldCheck size={20} />
          </div>
          <div>
            <p>Alert: No incidents reported in your area</p>
            <small>Low risk</small>
          </div>
        </div>
      </div>

      {/* IoT Integration */}
      <h3 className="section-title">IoT Integration (Optional)</h3>
      <div className="iot-card">
        <div className="iot-info">
          <div className="iot-icon-wrapper">
            <Activity size={20} />
          </div>
          <div>
            <p>Smart Band: Vital Signs</p>
            <small>Heart rate: 72bpm</small>
          </div>
        </div>
        <label className="switch">
          <input type="checkbox" />
          <span className="slider"></span>
        </label>
      </div>
    </div>
  );
};

export default Dashboard;
