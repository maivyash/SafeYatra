import React, { useState } from "react";
import "./CommonPages.css";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000";

const FIR = () => {
  const [form, setForm] = useState({
    crimeType: "",
    location: "",
    reporterName: "",
    reporterPhone: "",
    description: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE}/api/fir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json?.success) setResult(json.report);
      else alert(json?.message || "Failed to register FIR");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
    setSubmitting(false);
  };

  return (
    <div className="page-container">
      <h2 className="page-title">Register FIR</h2>
      <div className="panel">
        <form className="grid-2" onSubmit={submit}>
          <input
            className="input"
            required
            placeholder="Crime type"
            value={form.crimeType}
            onChange={(e) => setForm({ ...form, crimeType: e.target.value })}
          />
          <input
            className="input"
            required
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <input
            className="input"
            required
            placeholder="Your name"
            value={form.reporterName}
            onChange={(e) => setForm({ ...form, reporterName: e.target.value })}
          />
          <input
            className="input"
            required
            placeholder="Your phone"
            value={form.reporterPhone}
            onChange={(e) => setForm({ ...form, reporterPhone: e.target.value })}
          />
          <textarea
            className="textarea"
            required
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="btn-primary" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit FIR"}
          </button>
        </form>
      </div>

      {result && (
        <div className="panel" style={{ marginTop: 12 }}>
          <h4>FIR Submitted</h4>
          <div>FIR Number: <strong>{result.firNumber}</strong></div>
          <div>Status: {result.status}</div>
          <div>Date: {result.date} {result.time}</div>
        </div>
      )}
    </div>
  );
};

export default FIR;



