import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./CommonPages.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const SOS = () => {
  const { user } = useAuth();
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  const sendSOS = async () => {
    setSending(true);
    setStatus("");
    try {
      const pos = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej, {
          enableHighAccuracy: true,
        })
      );
      const payload = {
        userId: user?._id,
        name: user?.name,
        location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        timestamp: new Date().toISOString(),
      };
      await axios.post(`${API_BASE}/api/data/sos`, payload, {
        withCredentials: true,
      });
      setStatus("SOS sent.");
    } catch (err) {
      console.error(err);
      setStatus("Failed to send SOS.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">SOS</h2>
      <div className="panel">
        <p>Press the button below to send an SOS with your current location.</p>
        <button className="btn-danger" onClick={sendSOS} disabled={sending}>
          {sending ? "Sending..." : "Send SOS"}
        </button>
        {status && <div style={{ marginTop: 12 }}>{status}</div>}
      </div>
    </div>
  );
};

export default SOS;
