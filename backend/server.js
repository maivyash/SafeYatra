const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow your frontend origin
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend's actual origin
    credentials: true,
  })
);
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
// ...existing code...
//
//
//
const connectedUsers = {}; // To track connected users

const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};
const broadcastNearbyUsers = () => {
  // Iterate over every connected user
  for (const socketId in connectedUsers) {
    const currentUser = connectedUsers[socketId];
    const nearbyUsers = [];

    // For the current user, find who is nearby
    for (const otherSocketId in connectedUsers) {
      if (socketId !== otherSocketId) {
        const otherUser = connectedUsers[otherSocketId];
        const distance = getDistance(
          currentUser.location.lat,
          currentUser.location.lng,
          otherUser.location.lat,
          otherUser.location.lng
        );

        if (distance <= 1) {
          // Changed to 1km radius
          nearbyUsers.push(otherUser);
        }
      }
    }
    // Send the personalized list of nearby users to this specific user
    io.to(socketId).emit("nearbyUsersUpdate", nearbyUsers);
  }
};

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("updateLocation", (data) => {
    const { userId, name, location } = data;
    // Add or update the user's data
    connectedUsers[socket.id] = { userId, name, location };
    // Update everyone's map view
    broadcastNearbyUsers();
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    delete connectedUsers[socket.id];
    // Update everyone's map view now that this user has left
    broadcastNearbyUsers();
  });
});

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/mern-auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/data", require("./routes/data"));
app.use("/api/location", require("./routes/locations"));
app.use("/api/police", require("./routes/police"));

// Basic route
app.get("/", (req, res) => {
  res.json({ message: "Root BackEnd, Nothing here!" });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
