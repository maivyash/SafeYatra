import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";
const LS_KEY = "shareLiveContacts_v1";

const ShareLive = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [sharing, setSharing] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) setContacts(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(contacts));
  }, [contacts]);

  const addContact = (e) => {
    e.preventDefault();
    setContacts((s) => [...s, { id: Date.now(), ...form }]);
    setForm({ name: "", email: "", phone: "" });
  };

  const remove = (id) => setContacts((s) => s.filter((c) => c.id !== id));

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
    <div style={{ maxWidth: 820, margin: "24px auto", padding: 16 }}>
      <h2>Share Live</h2>
      <form
        onSubmit={addContact}
        style={{ display: "flex", gap: 8, marginBottom: 12 }}
      >
        <input
          required
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          required
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>

      <div>
        <h4>Contacts to share with</h4>
        {contacts.length === 0 && <div>No contacts yet.</div>}
        <ul>
          {contacts.map((c) => (
            <li
              key={c.id}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                marginBottom: 8,
              }}
            >
              <div>
                <strong>{c.name}</strong> • {c.email} • {c.phone}
              </div>
              <button onClick={() => remove(c.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>

      <div style={{ marginTop: 12 }}>
        <button onClick={shareNow} disabled={sharing || contacts.length === 0}>
          {sharing ? "Sharing..." : "Share Now"}
        </button>
      </div>
    </div>
  );
};

export default ShareLive;
