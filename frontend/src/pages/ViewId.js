import React from "react";
import { useAuth } from "../contexts/AuthContext";

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

  return (
    <div style={{ maxWidth: 520, margin: "24px auto", padding: 16 }}>
      <h2>View ID</h2>
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <img
          src={avatarUrl}
          alt="avatar"
          style={{ width: 120, height: 120, borderRadius: 12 }}
        />
        <div>
          <h3>{user?.name ?? "User"}</h3>
          <div>Email: {user?.email ?? "—"}</div>
          <div>Mobile: {user?.mobile ?? "—"}</div>
          <div>Aadhaar: {maskAadhaar(user?.aadhaarNumber)}</div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <h4>QR (UID)</h4>
        <img src={qrUrl} alt="qr" style={{ width: 150, height: 150 }} />
      </div>
    </div>
  );
};

export default ViewID;
