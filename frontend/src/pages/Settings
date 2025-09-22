import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Settings = () => {
  const { user, logout } = useAuth();
  const [locationSharing, setLocationSharing] = useState(true);
  const [iotEnabled, setIotEnabled] = useState(false);
  const [safetyScore, setSafetyScore] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/data/safety-score`, {
          withCredentials: true,
        });
        if (res.data?.success) setSafetyScore(res.data.score ?? 85);
        else setSafetyScore(85);
      } catch {
        setSafetyScore(85);
      }
    })();
  }, []);

  const savePreference = async (key, value) => {
    setSaving(true);
    setError("");
    try {
      await axios.post(
        `${API_BASE}/api/data/settings`,
        { [key]: value },
        { withCredentials: true }
      );
    } catch (err) {
      setError("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleLocation = async () => {
    const next = !locationSharing;
    setLocationSharing(next);
    await savePreference("locationSharing", next);
  };

  const toggleIot = async () => {
    const next = !iotEnabled;
    setIotEnabled(next);
    await savePreference("iotEnabled", next);
  };

  const refreshSafetyScore = async () => {
    setSaving(true);
    try {
      const res = await axios.get(`${API_BASE}/api/data/safety-score`, {
        withCredentials: true,
      });
      if (res.data?.success) setSafetyScore(res.data.score ?? 85);
    } catch {
      setError("Failed to refresh safety score");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="settings-page"
      style={{ maxWidth: 820, margin: "24px auto", padding: 16 }}
    >
      <h2>Settings</h2>
      <p>Account: {user?.email}</p>

      <section style={{ marginTop: 16 }}>
        <h3>Live Location</h3>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <label>
            <input
              type="checkbox"
              checked={locationSharing}
              onChange={toggleLocation}
            />{" "}
            Share my live location
          </label>
          <button
            onClick={() => savePreference("locationSharing", locationSharing)}
            disabled={saving}
          >
            Save
          </button>
        </div>
        <small style={{ color: "#666" }}>
          When enabled the dashboard will send your live location to the server.
        </small>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>IoT Integration</h3>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <label>
            <input type="checkbox" checked={iotEnabled} onChange={toggleIot} />{" "}
            Enable IoT (Smart band)
          </label>
          <button
            onClick={() => savePreference("iotEnabled", iotEnabled)}
            disabled={saving}
          >
            Save
          </button>
        </div>
        <small style={{ color: "#666" }}>
          Toggle IoT integration. Device pairing handled separately.
        </small>
      </section>

      <section style={{ marginTop: 16 }}>
        <h3>Safety Score</h3>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div>
            Current score: <strong>{safetyScore ?? "—"}</strong>
          </div>
          <button onClick={refreshSafetyScore} disabled={saving}>
            Refresh
          </button>
        </div>
        <small style={{ color: "#666" }}>
          Safety score currently provided by backend (static 85).
        </small>
      </section>

      <section style={{ marginTop: 16 }}>
        <button
          onClick={logout}
          style={{
            background: "#ef4444",
            color: "#fff",
            padding: "8px 12px",
            border: "none",
            borderRadius: 6,
          }}
        >
          Logout
        </button>
      </section>

      {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default Settings;
