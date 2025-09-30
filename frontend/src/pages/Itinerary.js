import React, { useState, useEffect } from "react";
import "./CommonPages.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Itinerary = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ place: "", date: "", notes: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_BASE}/api/itinerary/my`, {
          credentials: "include",
        });
        const json = await res.json();
        if (json?.success) setItems(json.items || []);
      } catch (_) {}
    })();
  }, []);

  const add = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json?.success) {
        setItems((s) => [json.item, ...s]);
        setForm({ place: "", date: "", notes: "" });
      }
    } catch (_) {}
    setLoading(false);
  };

  const remove = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/api/itinerary/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();
      if (json?.success) setItems((s) => s.filter((i) => i._id !== id));
    } catch (_) {}
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Itinerary</h2>
      <div className="panel">
        <form onSubmit={add} className="grid-2">
          <input className="input" required placeholder="Place name" value={form.place} onChange={(e) => setForm({ ...form, place: e.target.value })} />
          <input className="input" type="date" required value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          <textarea className="textarea" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          <button className="btn-primary" type="submit">Add to Itinerary</button>
        </form>
      </div>

      <div className="panel">
        <h4>Planned visits</h4>
        {items.length === 0 && <div>No itinerary items.</div>}
        <ul className="list">
          {items.map((it) => (
          <li key={it._id} className="list-item" style={{ marginBottom: 8 }}>
              <div>
                <strong>{it.place}</strong> — {it.date}
                <div style={{ color: "#64748b" }}>{it.notes}</div>
              </div>
              <button className="btn-danger" onClick={() => remove(it._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Itinerary;
