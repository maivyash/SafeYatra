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
  LocateFixed,
  Shield,
} from "lucide-react";
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
import { Link } from "react-router-dom";
const policeIcon = new L.Icon({
  iconUrl: "	https://cdn-icons-png.flaticon.com/512/10295/10295611.png",
  iconSize: [30, 30],
});

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const scoreColor = (score) => {
  if (score >= 75) return "#16a34a"; // green
  if (score >= 50) return "#f59e0b"; // yellow
  return "#ef4444"; // red
};
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const SOCKET_SERVER_URL = API_BASE;

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [currentLocation, setCurrentLocation] = useState(null);
  const [nearbyUsers, setNearbyUsers] = useState([]);
  const [areas, setAreas] = useState([]);
  const socketRef = useRef(null);
  const [map, setMap] = useState(null);
  const [locationName, setLocationName] = useState("Getting location...");
  const [safetyScore, setSafetyScore] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [stations, setStations] = useState([]);
  const controlsAddedRef = useRef(false);

  const handleRecenter = () => {
    if (map && currentLocation) {
      map.flyTo(currentLocation, 16, { animate: true });
    }
  };

  const handleLocateMe = () => {
    if (!map || !navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(loc);
        map.flyTo(loc, 16, { animate: true });
      },
      () => {},
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 }
    );
  };

  // fetch areas + static safety score (use backend /api/location)
  useEffect(() => {
    fetch(`http://localhost:5000/api/location/areas`)
      .then((r) => r.json())
      .then((j) => {
        if (j?.success) setAreas(j.areas || []);
      })
      .catch(() => {});
    fetch(`http://localhost:5000/api/location/safety-score`)
      .then((r) => r.json())
      .then((j) => setSafetyScore(j?.score ?? 85))
      .catch(() => setSafetyScore(85));
  }, []);

  // Throttle reverse-geocode calls
  const lastGeocodeAt = useRef(0);
  const geocodeThrottleMs = 10000;
  const fetchLocationName = async (lat, lng) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/location/reverse-geocode`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat, lng }),
        }
      );
      const json = await res.json();
      if (json?.success) setLocationName(json.locationName);
    } catch (e) {
      setLocationName("Unknown location");
    }
  };

  // create socket once on mount
  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, { transports: ["websocket"] });

    socketRef.current.on("connect", () => {
      console.log("✅ Connected to socket server", socketRef.current.id);
      // if user already available, identify immediately
      if (user) {
        socketRef.current.emit("identify", {
          userId: user._id,
          name: user.name,
        });
      }
    });

    socketRef.current.on("nearbyUsersUpdate", (users) => {
      setNearbyUsers(users || []);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    return () => {
      socketRef.current?.disconnect();
    };
    // run once
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // when user becomes available, tell server who we are
  useEffect(() => {
    if (!socketRef.current) return;
    if (user) {
      socketRef.current.emit("identify", { userId: user._id, name: user.name });
      // if we already have location, immediately send it
      if (currentLocation) {
        socketRef.current.emit("updateLocation", {
          userId: user._id,
          name: user.name,
          location: currentLocation,
        });
      }
    }
  }, [user, currentLocation]);
  useEffect(() => {
    if (selectedArea) {
      alert(
        `You entered ${selectedArea.area_name} (Safety: ${selectedArea.safety_score}/100)`
      );
    }
  }, [selectedArea]);

  const isPointInPolygon = (point, vs) => {
    const x = point[0],
      y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i][0],
        yi = vs[i][1];
      const xj = vs[j][0],
        yj = vs[j][1];
      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  };

  useEffect(() => {
    if (!currentLocation || areas.length === 0) return;

    const point = [currentLocation.lat, currentLocation.lng];
    let foundArea = null;

    for (const area of areas) {
      if (
        area.polygon_coords?.length >= 3 &&
        isPointInPolygon(point, area.polygon_coords)
      ) {
        foundArea = area;
        break;
      }
    }

    if (foundArea) {
      setSelectedArea(foundArea);
      console.log("✅ User entered area:", foundArea.area_name);
    } else {
      setSelectedArea(null);
    }
  }, [currentLocation, areas]);
  useEffect(() => {
    fetch("http://localhost:5000/api/location/police-stations")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStations(data.stations);
          console.log(stations);
        }
      });
  }, []);
  // Add custom Leaflet controls (once when map available)
  useEffect(() => {
    if (!map || controlsAddedRef.current) return;
    controlsAddedRef.current = true;
    const recenterCtrl = L.control({ position: "topleft" });
    recenterCtrl.onAdd = function () {
      const container = L.DomUtil.create("div", "leaflet-bar recenter-control");
      const btn = L.DomUtil.create("a", "recenter-control-btn", container);
      btn.href = "#";
      btn.title = "Recenter";
      btn.innerHTML = "⌖";
      L.DomEvent.on(btn, "click", (e) => {
        L.DomEvent.preventDefault(e);
        L.DomEvent.stopPropagation(e);
        handleRecenter();
      });
      return container;
    };
    recenterCtrl.addTo(map);

    const locateCtrl = L.control({ position: "topleft" });
    locateCtrl.onAdd = function () {
      const container = L.DomUtil.create("div", "leaflet-bar recenter-control");
      const btn = L.DomUtil.create("a", "recenter-control-btn", container);
      btn.href = "#";
      btn.title = "Locate me";
      btn.innerHTML = "📍";
      L.DomEvent.on(btn, "click", (e) => {
        L.DomEvent.preventDefault(e);
        L.DomEvent.stopPropagation(e);
        handleLocateMe();
      });
      return container;
    };
    locateCtrl.addTo(map);

    return () => {
      // Leaflet doesn't give direct remove on custom controls reference here
      try { recenterCtrl.remove(); } catch(e) {}
      try { locateCtrl.remove(); } catch(e) {}
    };
  }, [map]);
  // geolocation watch and emit location updates
  useEffect(() => {
    if (!("geolocation" in navigator)) {
      console.error("Geolocation not available");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const loc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setCurrentLocation(loc);

        const now = Date.now();
        if (now - lastGeocodeAt.current > geocodeThrottleMs) {
          lastGeocodeAt.current = now;
          fetchLocationName(loc.lat, loc.lng);
        }

        if (user && socketRef.current?.connected) {
          socketRef.current.emit("updateLocation", {
            userId: user._id,
            name: user.name,
            location: loc,
          });
        }
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [user]);

  return (
    <div className="dashboard-container">
      {/* Header with welcome and quick stats */}
      <header className="dashboard-header">
        <div className="brand-title">
          <h1 className="logo">SafeYatra Dashboard</h1>
          <span className="brand-sub">Your safety companion</span>
        </div>
      </header>

      <section className="stats-row">
        <div className="stat-card">
          <span className="stat-label">Safety Score</span>
          <div className="stat-value">
            <span className="big">{safetyScore ?? "–"}</span>
            <span className="suffix">/100</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Current Location</span>
          <div className="stat-value location">
            <MapPin size={18} />
            <span className="truncate">{locationName}</span>
          </div>
        </div>
        <div className="stat-card">
          <span className="stat-label">Nearby Users</span>
          <div className="stat-value"><span className="big">{nearbyUsers?.length || 0}</span></div>
        </div>
      </section>

      {/* Map */}
      <h3 className="section-title">Live Map</h3>
      <div className="map-container">
        {currentLocation ? (
          <>
            <MapContainer
              center={currentLocation}
              zoom={15}
              style={{ height: "400px", width: "100%" }}
              whenCreated={(m) => setMap(m)}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

              {/* draw geofence polygons or markers for small areas */}
              {areas.map((a, idx) => {
                const coords = (a.polygon_coords || []).map((c) => [
                  c[0],
                  c[1],
                ]);
                if (coords.length >= 3) {
                  return (
                    <Polygon
                      key={a.area_id || idx}
                      positions={coords}
                      pathOptions={{
                        color: scoreColor(a.safety_score),
                        weight: 2,
                        fillOpacity: 0.12,
                      }}
                    >
                      <Tooltip direction="center" permanent={false}>
                        <div style={{ fontSize: 12, lineHeight: 1.1 }}>
                          <strong>{a.area_name || "Area"}</strong>
                          <br />
                          Safety: {a.safety_score ?? "N/A"}/100
                          <br />
                          Crime: {a.crime_count ?? "N/A"}
                        </div>
                      </Tooltip>
                    </Polygon>
                  );
                }
                // fallback: draw circle marker at single coord or skip
                if (coords.length === 1) {
                  const [lat, lng] = coords[0];
                  return (
                    <CircleMarker
                      key={a.area_id || idx}
                      center={[lat, lng]}
                      radius={8}
                      pathOptions={{
                        color: scoreColor(a.safety_score),
                        fillOpacity: 0.4,
                      }}
                    >
                      <Tooltip>
                        {a.area_name || "Area"} — Safety:{" "}
                        {a.safety_score ?? "N/A"}
                      </Tooltip>
                    </CircleMarker>
                  );
                }
                return null;
              })}
              {/* Show all police stations */}
              {stations.map((station, index) => (
                <Marker
                  key={index}
                  position={[station.lat, station.lng]}
                  icon={policeIcon}
                >
                  <Popup>
                    <h3>{station.name}</h3>
                    <p>
                      <b>Address:</b> {station.address}
                    </p>
                    <p>
                      <b>Contact:</b> {station.phone || "N/A"}
                    </p>
                    <p>
                      <b>Jurisdiction:</b> {station.division}
                    </p>
                  </Popup>
                </Marker>
              ))}

              <Marker position={currentLocation}>
                <Popup>You are here</Popup>
              </Marker>

              {nearbyUsers
                .filter((u) => u.userId !== user?._id)
                .map((u) => (
                  <Marker
                    key={u.userId}
                    position={[u.location.lat, u.location.lng]}
                    icon={L.icon({
                      iconUrl: "https://i.pravatar.cc/30?u=" + u.userId,
                      iconSize: [30, 30],
                    })}
                  >
                    <Popup>
                      <strong>{u.name}</strong>
                      <div>{(u.distanceKm ?? "").toString()} km</div>
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </>
        ) : (
          <div className="map-loading">Getting your location...</div>
        )}
      </div>

      {/* Quick Actions */}
      <h3 className="section-title">Quick Actions</h3>
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

