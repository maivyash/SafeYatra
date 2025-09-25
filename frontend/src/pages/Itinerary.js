import React, { useState, useEffect } from "react";

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
    <div style={{ maxWidth: 820, margin: "24px auto", padding: 16 }}>
      <h2>Itinerary</h2>
      <form onSubmit={add} style={{ display: "grid", gap: 8 }}>
        <input
          required
          placeholder="Place name"
          value={form.place}
          onChange={(e) => setForm({ ...form, place: e.target.value })}
        />
        <input
          type="date"
          required
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
        />
        <textarea
          placeholder="Notes"
          value={form.notes}
          onChange={(e) => setForm({ ...form, notes: e.target.value })}
        />
        <button type="submit">Add to Itinerary</button>
      </form>

      <div style={{ marginTop: 16 }}>
        <h4>Planned visits</h4>
        {items.length === 0 && <div>No itinerary items.</div>}
        <ul>
          {items.map((it) => (
            <li key={it.id} style={{ marginBottom: 12 }}>
              <div>
                <strong>{it.place}</strong> — {it.date}
              </div>
              <div>{it.notes}</div>
              <button onClick={() => remove(it.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Itinerary;
