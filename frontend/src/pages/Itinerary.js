import React, { useState, useEffect } from "react";
import "./CommonPages.css";

const LS_KEY = "user_itinerary_v1";

const Itinerary = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ place: "", date: "", notes: "" });

  useEffect(() => {
    const saved = localStorage.getItem(LS_KEY);
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
  }, [items]);

  const add = (e) => {
    e.preventDefault();
    setItems((s) => [...s, { id: Date.now(), ...form }]);
    setForm({ place: "", date: "", notes: "" });
  };

  const remove = (id) => setItems((s) => s.filter((i) => i.id !== id));

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
            <li key={it.id} className="list-item" style={{ marginBottom: 8 }}>
              <div>
                <strong>{it.place}</strong> — {it.date}
                <div style={{ color: "#64748b" }}>{it.notes}</div>
              </div>
              <button className="btn-danger" onClick={() => remove(it.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Itinerary;
