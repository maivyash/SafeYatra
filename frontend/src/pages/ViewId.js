import React, { useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import "./CommonPages.css";

const ViewID = () => {
  const { user } = useAuth();
  const avatarUrl =
    user?.avatar || `https://i.pravatar.cc/150?u=${user?._id || "anon"}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${
    user?._id || "guest"
  }`;

  const maskAadhaar = (aad) => {
    if (!aad) return "Not provided";
    const s = aad.toString();
    const last4 = s.slice(-4);
    return `XXXX XXXX ${last4}`;
  };

  const imgRef = useRef(null);

  const copyQrImage = async () => {
    try {
      const img = imgRef.current;
      if (!img) return;
      const res = await fetch(img.src);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new window.ClipboardItem({ [blob.type]: blob })
      ]);
      alert("QR code copied to clipboard");
    } catch (e) {
      try {
        // Fallback: open in new tab if ClipboardItem not supported
        window.open(qrUrl, "_blank");
      } catch {}
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <h2 className="page-title">Digital ID</h2>
      <div className="panel" style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <img src={avatarUrl} alt="avatar" className="avatar" />
        <div>
          <h3 style={{ margin: 0 }}>{user?.name ?? "User"}</h3>
          <div>Email: {user?.email ?? "—"}</div>
          <div>Mobile: {user?.mobile ?? "—"}</div>
          <div>Aadhaar: {maskAadhaar(user?.aadhaarNumber)}</div>
        </div>
      </div>

      <div className="panel" style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <div>
          <h4 style={{ margin: 0 }}>QR (UID)</h4>
          <small style={{ color: "#64748b" }}>Scan to verify identity</small>
        </div>
        <img ref={imgRef} src={qrUrl} alt="qr" style={{ width: 150, height: 150 }} />
        <button className="btn-primary" onClick={copyQrImage}>Copy QR</button>
      </div>
    </div>
  );
};

export default ViewID;
