import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import axios from "axios";
import "./CommonPages.css";

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

  // helpers
  const avatarUrl = user?.avatar || `https://i.pravatar.cc/120?u=${user?._id || "anon"}`;
  const maskAadhaar = (aad) => {
    if (!aad) return "Not provided";
    const s = aad.toString();
    const last4 = s.slice(-4);
    return `XXXX XXXX ${last4}`;
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Settings</h2>
      {/* Account Overview with full user details */}
      <div className="panel">
        <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-start" }}>
          <div className="row" style={{ alignItems: "center" }}>
            <img src={avatarUrl} alt="avatar" className="avatar" />
            <div style={{ marginLeft: 12 }}>
              <h3 style={{ margin: 0 }}>{user?.name || "User"}</h3>
              <div style={{ color: "#64748b" }}>UID: {user?._id || "—"}</div>
            </div>
          </div>
          <button className="btn-danger" onClick={logout}>Logout</button>
        </div>

        <div className="grid-2" style={{ marginTop: 12 }}>
          <div>
            <small style={{ color: "#64748b" }}>Email</small>
            <div><strong>{user?.email || "—"}</strong></div>
          </div>
          <div>
            <small style={{ color: "#64748b" }}>Mobile</small>
            <div><strong>{user?.mobile || "—"}</strong></div>
          </div>
          <div>
            <small style={{ color: "#64748b" }}>Date of Birth</small>
            <div><strong>{user?.dateOfBirth || "—"}</strong></div>
          </div>
          <div>
            <small style={{ color: "#64748b" }}>Gender</small>
            <div><strong>{user?.gender || "—"}</strong></div>
          </div>
          <div>
            <small style={{ color: "#64748b" }}>Aadhaar</small>
            <div><strong>{maskAadhaar(user?.aadhaarNumber)}</strong></div>
          </div>
          <div>
            <small style={{ color: "#64748b" }}>Account Created</small>
            <div><strong>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</strong></div>
          </div>
        </div>
      </div>

      <div className="panel">
        <h3>Live Location</h3>
        <div className="row">
          <label>
            <input type="checkbox" checked={locationSharing} onChange={toggleLocation} />{" "}
            Share my live location
          </label>
          <button className="btn-primary" onClick={() => savePreference("locationSharing", locationSharing)} disabled={saving}>Save</button>
        </div>
        <small style={{ color: "#64748b" }}>When enabled the dashboard will send your live location to the server.</small>
      </div>

      <div className="panel">
        <h3>IoT Integration</h3>
        <div className="row">
          <label>
            <input type="checkbox" checked={iotEnabled} onChange={toggleIot} />{" "}
            Enable IoT (Smart band)
          </label>
          <button className="btn-primary" onClick={() => savePreference("iotEnabled", iotEnabled)} disabled={saving}>Save</button>
        </div>
        <small style={{ color: "#64748b" }}>Toggle IoT integration. Device pairing handled separately.</small>
      </div>

      <div className="panel">
        <h3>Safety Score</h3>
        <div className="row">
          <div>Current score: <strong>{safetyScore ?? "—"}</strong></div>
          <button className="btn-primary" onClick={refreshSafetyScore} disabled={saving}>Refresh</button>
        </div>
        <small style={{ color: "#64748b" }}>Safety score currently provided by backend (static 85).</small>
      </div>

      {error && <div style={{ color: "#ef4444", marginTop: 12 }}>{error}</div>}
    </div>
  );
};

export default Settings;
