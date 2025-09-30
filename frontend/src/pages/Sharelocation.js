import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import "./CommonPages.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const ShareLive = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [sharing, setSharing] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/share/contacts/my`, { withCredentials: true });
        if (res.data?.success) setContacts(res.data.contacts || []);
      } catch (_) {}
    })();
  }, []);

  const addContact = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${API_BASE}/api/share/contacts`,
        { contacts: [{ ...form }] },
        { withCredentials: true }
      );
      if (res.data?.success) {
        setContacts((s) => [...res.data.contacts, ...s]);
        setForm({ name: "", email: "", phone: "" });
      }
    } catch (_) {}
  };

  const remove = async (id) => {
    try {
      const res = await axios.delete(`${API_BASE}/api/share/contacts/${id}`, { withCredentials: true });
      if (res.data?.success) setContacts((s) => s.filter((c) => c._id !== id));
    } catch (_) {}
  };

  const shareNow = async () => {
    if (!contacts.length) return;
    setSharing(true);
    try {
      // Example: backend endpoint to register share list /api/data/share with credentials
      await axios.post(
        `${API_BASE}/api/data/share`,
        { userId: user?._id, contacts },
        { withCredentials: true }
      );
      // Optionally trigger share immediately (not implemented server-side)
      alert("Share request sent to server.");
    } catch (err) {
      console.error(err);
      alert("Failed to notify server. Contacts stored locally.");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Share Live</h2>
      <div className="panel">
        <form onSubmit={addContact} className="grid-2" style={{ marginBottom: 12 }}>
          <input className="input" required placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="input" required placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <input className="input" required placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <button type="submit" className="btn-primary">Add</button>
        </form>
        <div>
          <h4>Contacts to share with</h4>
          {contacts.length === 0 && <div>No contacts yet.</div>}
          <ul className="list">
            {contacts.map((c) => (
              <li key={c._id} className="list-item" style={{ marginBottom: 8 }}>
                <div>
                  <strong>{c.name}</strong> • {c.email} • {c.phone}
                </div>
                <button className="btn-danger" onClick={() => remove(c._id)}>Remove</button>
              </li>
            ))}
          </ul>
        </div>
        <div style={{ marginTop: 12 }}>
          <button className="btn-primary" onClick={shareNow} disabled={sharing || contacts.length === 0}>
            {sharing ? "Sharing..." : "Share Now"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareLive;
