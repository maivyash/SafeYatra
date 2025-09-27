const express = require("express");
const router = express.Router();

// Enhanced dummy data for tourists
const dummyTourists = [
  {
    id: "T001",
    name: "Sarah Johnson",
    avatar: "https://i.pravatar.cc/150?img=1",
    lat: 18.5204,
    lng: 73.8567,
    location: "Shivajinagar, Pune",
    status: "active",
    phone: "+91-9876543210",
    lastSeen: "2 minutes ago",
    emergencyContact: "+91-9876543211",
    nationality: "American",
    passportNumber: "US123456789",
    checkInDate: "2024-01-15",
    hotelName: "Hotel Taj",
    itinerary: ["Shaniwar Wada", "Aga Khan Palace", "Sinhagad Fort"],
    age: 28,
    gender: "Female",
    occupation: "Software Engineer",
    travelPurpose: "Tourism",
    groupSize: 1,
    riskLevel: "Low",
    healthStatus: "Good",
    language: "English",
    emergencyNotes: "Allergic to peanuts"
  },
  {
    id: "T002",
    name: "Michael Chen",
    avatar: "https://i.pravatar.cc/150?img=2",
    lat: 18.5335,
    lng: 73.8855,
    location: "Koregaon Park, Pune",
    status: "active",
    phone: "+91-9876543212",
    lastSeen: "5 minutes ago",
    emergencyContact: "+91-9876543213",
    nationality: "Chinese",
    passportNumber: "CN987654321",
    checkInDate: "2024-01-14",
    hotelName: "Hotel Marriott",
    itinerary: ["Dagdusheth Temple", "Pune University", "Katraj Zoo"],
    age: 35,
    gender: "Male",
    occupation: "Business Executive",
    travelPurpose: "Business",
    groupSize: 2,
    riskLevel: "Medium",
    healthStatus: "Good",
    language: "Mandarin",
    emergencyNotes: "Has diabetes, carries insulin"
  },
  {
    id: "T003",
    name: "Emma Rodriguez",
    avatar: "https://i.pravatar.cc/150?img=3",
    lat: 18.5249,
    lng: 73.8756,
    location: "Bund Garden, Pune",
    status: "active",
    phone: "+91-9876543214",
    lastSeen: "1 minute ago",
    emergencyContact: "+91-9876543215",
    nationality: "Spanish",
    passportNumber: "ES456789123",
    checkInDate: "2024-01-16",
    hotelName: "Hotel Hyatt",
    itinerary: ["Rajgad Fort", "Mulshi Lake", "Lavasa"]
  },
  {
    id: "T004",
    name: "David Kim",
    avatar: "https://i.pravatar.cc/150?img=4",
    lat: 18.5067,
    lng: 73.8025,
    location: "Kothrud, Pune",
    status: "active",
    phone: "+91-9876543216",
    lastSeen: "3 minutes ago",
    emergencyContact: "+91-9876543217",
    nationality: "Korean",
    passportNumber: "KR789123456",
    checkInDate: "2024-01-13",
    hotelName: "Hotel ITC",
    itinerary: ["Pataleshwar Cave Temple", "Pune Okayama Friendship Garden"]
  },
  {
    id: "T005",
    name: "Lisa Anderson",
    avatar: "https://i.pravatar.cc/150?img=5",
    lat: 18.5569,
    lng: 73.9089,
    location: "Viman Nagar, Pune",
    status: "active",
    phone: "+91-9876543218",
    lastSeen: "4 minutes ago",
    emergencyContact: "+91-9876543219",
    nationality: "Australian",
    passportNumber: "AU321654987",
    checkInDate: "2024-01-12",
    hotelName: "Hotel Le Meridien",
    itinerary: ["Mahatma Phule Museum", "Pune Railway Station"]
  },
  {
    id: "T006",
    name: "Ahmed Hassan",
    avatar: "https://i.pravatar.cc/150?img=6",
    lat: 18.4661,
    lng: 73.8905,
    location: "Kondhwa, Pune",
    status: "active",
    phone: "+91-9876543220",
    lastSeen: "6 minutes ago",
    emergencyContact: "+91-9876543221",
    nationality: "Egyptian",
    passportNumber: "EG654987321",
    checkInDate: "2024-01-11",
    hotelName: "Hotel Courtyard",
    itinerary: ["Osho International Meditation Resort", "Koregaon Park"]
  },
  {
    id: "T007",
    name: "Maria Garcia",
    avatar: "https://i.pravatar.cc/150?img=7",
    lat: 18.6293,
    lng: 73.8076,
    location: "Pimpri, Pune",
    status: "active",
    phone: "+91-9876543222",
    lastSeen: "7 minutes ago",
    emergencyContact: "+91-9876543223",
    nationality: "Mexican",
    passportNumber: "MX987321654",
    checkInDate: "2024-01-10",
    hotelName: "Hotel Radisson",
    itinerary: ["Pimpri Chinchwad Science Park", "Empress Garden"]
  },
  {
    id: "T008",
    name: "James Wilson",
    avatar: "https://i.pravatar.cc/150?img=8",
    lat: 18.591,
    lng: 73.7707,
    location: "Wakad, Pune",
    status: "active",
    phone: "+91-9876543224",
    lastSeen: "8 minutes ago",
    emergencyContact: "+91-9876543225",
    nationality: "British",
    passportNumber: "GB654321987",
    checkInDate: "2024-01-09",
    hotelName: "Hotel Novotel",
    itinerary: ["Wakad IT Park", "Pune International Airport"],
    age: 42,
    gender: "Male",
    occupation: "Professor",
    travelPurpose: "Academic",
    groupSize: 1,
    riskLevel: "Low",
    healthStatus: "Good",
    language: "English",
    emergencyNotes: "None"
  },
  {
    id: "T009",
    name: "Priya Sharma",
    avatar: "https://i.pravatar.cc/150?img=9",
    lat: 18.5067,
    lng: 73.8025,
    location: "Kothrud, Pune",
    status: "active",
    phone: "+91-9876543226",
    lastSeen: "1 minute ago",
    emergencyContact: "+91-9876543227",
    nationality: "Indian",
    passportNumber: "IN123456789",
    checkInDate: "2024-01-17",
    hotelName: "Hotel Radisson",
    itinerary: ["Pataleshwar Cave Temple", "Pune Okayama Friendship Garden"],
    age: 26,
    gender: "Female",
    occupation: "Doctor",
    travelPurpose: "Medical Conference",
    groupSize: 3,
    riskLevel: "Low",
    healthStatus: "Excellent",
    language: "Hindi",
    emergencyNotes: "Medical professional"
  },
  {
    id: "T010",
    name: "Alexandre Dubois",
    avatar: "https://i.pravatar.cc/150?img=10",
    lat: 18.5569,
    lng: 73.9089,
    location: "Viman Nagar, Pune",
    status: "active",
    phone: "+91-9876543228",
    lastSeen: "3 minutes ago",
    emergencyContact: "+91-9876543229",
    nationality: "French",
    passportNumber: "FR987654321",
    checkInDate: "2024-01-16",
    hotelName: "Hotel Le Meridien",
    itinerary: ["Mahatma Phule Museum", "Pune Railway Station"],
    age: 31,
    gender: "Male",
    occupation: "Chef",
    travelPurpose: "Culinary Tourism",
    groupSize: 1,
    riskLevel: "Medium",
    healthStatus: "Good",
    language: "French",
    emergencyNotes: "Vegetarian diet"
  }
];

// Dummy SOS alerts
const dummySOSAlerts = [
  {
    id: "SOS001",
    touristId: "T001",
    touristName: "Sarah Johnson",
    lat: 18.5204,
    lng: 73.8567,
    location: "Shivajinagar, Pune",
    message: "Lost my way, need help finding hotel",
    timestamp: "2024-01-15 14:30:00",
    status: "active",
    priority: "medium",
    assignedOfficer: null,
    responseTime: null
  },
  {
    id: "SOS002",
    touristId: "T003",
    touristName: "Emma Rodriguez",
    lat: 18.5249,
    lng: 73.8756,
    location: "Bund Garden, Pune",
    message: "Medical emergency, need ambulance",
    timestamp: "2024-01-15 15:45:00",
    status: "active",
    priority: "high",
    assignedOfficer: "Inspector Rajesh Kumar",
    responseTime: "5 minutes"
  },
  {
    id: "SOS003",
    touristId: "T005",
    touristName: "Lisa Anderson",
    lat: 18.5569,
    lng: 73.9089,
    location: "Viman Nagar, Pune",
    message: "Wallet stolen, need police assistance",
    timestamp: "2024-01-15 16:20:00",
    status: "resolved",
    priority: "medium",
    assignedOfficer: "Constable Priya Sharma",
    responseTime: "8 minutes"
  },
  {
    id: "SOS004",
    touristId: "T009",
    touristName: "Priya Sharma",
    lat: 18.5067,
    lng: 73.8025,
    location: "Kothrud, Pune",
    message: "Medical emergency - colleague collapsed",
    timestamp: "2024-01-15 17:10:00",
    status: "active",
    priority: "high",
    assignedOfficer: "Inspector Rajesh Kumar",
    responseTime: "3 minutes"
  },
  {
    id: "SOS005",
    touristId: "T010",
    touristName: "Alexandre Dubois",
    lat: 18.5569,
    lng: 73.9089,
    location: "Viman Nagar, Pune",
    message: "Lost passport, need embassy contact",
    timestamp: "2024-01-15 18:30:00",
    status: "active",
    priority: "medium",
    assignedOfficer: null,
    responseTime: null
  }
];

// Dummy FIR reports
const dummyFIRReports = [
  {
    id: "FIR001",
    firNumber: "FIR/2024/001",
    crimeType: "Theft",
    location: "Koregaon Park, Pune",
    reporterName: "Michael Chen",
    reporterPhone: "+91-9876543212",
    date: "2024-01-15",
    time: "10:30 AM",
    status: "under_investigation",
    description: "Mobile phone stolen from backpack while visiting Dagdusheth Temple. Suspect described as tall male, wearing blue shirt.",
    assignedOfficer: "Inspector Rajesh Kumar",
    evidence: ["CCTV footage", "Witness statements"],
    caseStatus: "Active"
  },
  {
    id: "FIR002",
    firNumber: "FIR/2024/002",
    crimeType: "Fraud",
    location: "Shivajinagar, Pune",
    reporterName: "Sarah Johnson",
    reporterPhone: "+91-9876543210",
    date: "2024-01-14",
    time: "2:15 PM",
    status: "resolved",
    description: "Credit card fraud - unauthorized transactions made while staying at hotel. Card was never lost.",
    assignedOfficer: "Constable Priya Sharma",
    evidence: ["Bank statements", "Hotel CCTV"],
    caseStatus: "Closed"
  },
  {
    id: "FIR003",
    firNumber: "FIR/2024/003",
    crimeType: "Harassment",
    location: "Bund Garden, Pune",
    reporterName: "Emma Rodriguez",
    reporterPhone: "+91-9876543214",
    date: "2024-01-13",
    time: "7:45 PM",
    status: "under_investigation",
    description: "Sexual harassment by unknown person while walking in park. Suspect followed for 10 minutes before disappearing.",
    assignedOfficer: "Inspector Rajesh Kumar",
    evidence: ["Witness statements", "Park surveillance"],
    caseStatus: "Active"
  },
  {
    id: "FIR004",
    firNumber: "FIR/2024/004",
    crimeType: "Assault",
    location: "Kothrud, Pune",
    reporterName: "David Kim",
    reporterPhone: "+91-9876543216",
    date: "2024-01-12",
    time: "11:20 AM",
    status: "pending",
    description: "Physical assault during argument with local vendor over pricing. Minor injuries sustained.",
    assignedOfficer: "Constable Priya Sharma",
    evidence: ["Medical report", "Vendor statement"],
    caseStatus: "Pending"
  },
  {
    id: "FIR005",
    firNumber: "FIR/2024/005",
    crimeType: "Lost Property",
    location: "Viman Nagar, Pune",
    reporterName: "Lisa Anderson",
    reporterPhone: "+91-9876543218",
    date: "2024-01-11",
    time: "3:30 PM",
    status: "resolved",
    description: "Lost passport and travel documents while visiting Mahatma Phule Museum. Documents found and returned.",
    assignedOfficer: "Inspector Rajesh Kumar",
    evidence: ["Found property report", "Identification verification"],
    caseStatus: "Closed"
  },
  {
    id: "FIR006",
    firNumber: "FIR/2024/006",
    crimeType: "Cyber Crime",
    location: "Koregaon Park, Pune",
    reporterName: "Michael Chen",
    reporterPhone: "+91-9876543212",
    date: "2024-01-16",
    time: "11:45 AM",
    status: "under_investigation",
    description: "Online banking fraud - unauthorized transactions from hotel WiFi. Suspect accessed account through public network.",
    assignedOfficer: "Constable Priya Sharma",
    evidence: ["Bank statements", "Hotel WiFi logs", "Device forensics"],
    caseStatus: "Active"
  },
  {
    id: "FIR007",
    firNumber: "FIR/2024/007",
    crimeType: "Robbery",
    location: "Bund Garden, Pune",
    reporterName: "Emma Rodriguez",
    reporterPhone: "+91-9876543214",
    date: "2024-01-17",
    time: "9:20 PM",
    status: "pending",
    description: "Armed robbery at ATM - cash and jewelry stolen. Suspects fled on motorcycle.",
    assignedOfficer: "Inspector Rajesh Kumar",
    evidence: ["ATM CCTV footage", "Witness statements"],
    caseStatus: "Pending"
  },
  {
    id: "FIR008",
    firNumber: "FIR/2024/008",
    crimeType: "Drug Possession",
    location: "Kondhwa, Pune",
    reporterName: "Ahmed Hassan",
    reporterPhone: "+91-9876543220",
    date: "2024-01-18",
    time: "2:15 PM",
    status: "under_investigation",
    description: "Found suspicious substances in hotel room during routine check. Substances sent for lab analysis.",
    assignedOfficer: "Constable Priya Sharma",
    evidence: ["Substance samples", "Hotel room photos", "Lab report"],
    caseStatus: "Active"
  }
];

// Routes

// GET /api/police/tourists - Get all tourists
router.get("/tourists", (req, res) => {
  try {
    res.json({
      success: true,
      tourists: dummyTourists,
      total: dummyTourists.length
    });
  } catch (error) {
    console.error("Error fetching tourists:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tourists data"
    });
  }
});

// GET /api/police/tourists/:id - Get specific tourist
router.get("/tourists/:id", (req, res) => {
  try {
    const tourist = dummyTourists.find(t => t.id === req.params.id);
    if (!tourist) {
      return res.status(404).json({
        success: false,
        message: "Tourist not found"
      });
    }
    res.json({
      success: true,
      tourist
    });
  } catch (error) {
    console.error("Error fetching tourist:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching tourist data"
    });
  }
});

// GET /api/police/sos-alerts - Get all SOS alerts
router.get("/sos-alerts", (req, res) => {
  try {
    res.json({
      success: true,
      alerts: dummySOSAlerts,
      total: dummySOSAlerts.length
    });
  } catch (error) {
    console.error("Error fetching SOS alerts:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching SOS alerts data"
    });
  }
});

// POST /api/police/sos-alerts - Create new SOS alert
router.post("/sos-alerts", (req, res) => {
  try {
    const { touristId, touristName, lat, lng, location, message } = req.body;
    
    const newAlert = {
      id: `SOS${String(dummySOSAlerts.length + 1).padStart(3, '0')}`,
      touristId,
      touristName,
      lat,
      lng,
      location,
      message,
      timestamp: new Date().toISOString(),
      status: "active",
      priority: "medium",
      assignedOfficer: null,
      responseTime: null
    };
    
    dummySOSAlerts.unshift(newAlert);
    
    res.json({
      success: true,
      alert: newAlert,
      message: "SOS alert created successfully"
    });
  } catch (error) {
    console.error("Error creating SOS alert:", error);
    res.status(500).json({
      success: false,
      message: "Error creating SOS alert"
    });
  }
});

// PUT /api/police/sos-alerts/:id - Update SOS alert status
router.put("/sos-alerts/:id", (req, res) => {
  try {
    const { status, assignedOfficer, responseTime } = req.body;
    const alertIndex = dummySOSAlerts.findIndex(a => a.id === req.params.id);
    
    if (alertIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "SOS alert not found"
      });
    }
    
    dummySOSAlerts[alertIndex] = {
      ...dummySOSAlerts[alertIndex],
      status: status || dummySOSAlerts[alertIndex].status,
      assignedOfficer: assignedOfficer || dummySOSAlerts[alertIndex].assignedOfficer,
      responseTime: responseTime || dummySOSAlerts[alertIndex].responseTime
    };
    
    res.json({
      success: true,
      alert: dummySOSAlerts[alertIndex],
      message: "SOS alert updated successfully"
    });
  } catch (error) {
    console.error("Error updating SOS alert:", error);
    res.status(500).json({
      success: false,
      message: "Error updating SOS alert"
    });
  }
});

// GET /api/police/fir-reports - Get all FIR reports
router.get("/fir-reports", (req, res) => {
  try {
    res.json({
      success: true,
      reports: dummyFIRReports,
      total: dummyFIRReports.length
    });
  } catch (error) {
    console.error("Error fetching FIR reports:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching FIR reports data"
    });
  }
});

// GET /api/police/fir-reports/:id - Get specific FIR report
router.get("/fir-reports/:id", (req, res) => {
  try {
    const fir = dummyFIRReports.find(f => f.id === req.params.id);
    if (!fir) {
      return res.status(404).json({
        success: false,
        message: "FIR report not found"
      });
    }
    res.json({
      success: true,
      report: fir
    });
  } catch (error) {
    console.error("Error fetching FIR report:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching FIR report data"
    });
  }
});

// POST /api/police/fir-reports - Create new FIR report
router.post("/fir-reports", (req, res) => {
  try {
    const {
      crimeType,
      location,
      reporterName,
      reporterPhone,
      description,
      assignedOfficer
    } = req.body;
    
    const newFIR = {
      id: `FIR${String(dummyFIRReports.length + 1).padStart(3, '0')}`,
      firNumber: `FIR/2024/${String(dummyFIRReports.length + 1).padStart(3, '0')}`,
      crimeType,
      location,
      reporterName,
      reporterPhone,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      status: "pending",
      description,
      assignedOfficer: assignedOfficer || "Unassigned",
      evidence: [],
      caseStatus: "Pending"
    };
    
    dummyFIRReports.unshift(newFIR);
    
    res.json({
      success: true,
      report: newFIR,
      message: "FIR report created successfully"
    });
  } catch (error) {
    console.error("Error creating FIR report:", error);
    res.status(500).json({
      success: false,
      message: "Error creating FIR report"
    });
  }
});

// PUT /api/police/fir-reports/:id - Update FIR report
router.put("/fir-reports/:id", (req, res) => {
  try {
    const firIndex = dummyFIRReports.findIndex(f => f.id === req.params.id);
    
    if (firIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "FIR report not found"
      });
    }
    
    dummyFIRReports[firIndex] = {
      ...dummyFIRReports[firIndex],
      ...req.body
    };
    
    res.json({
      success: true,
      report: dummyFIRReports[firIndex],
      message: "FIR report updated successfully"
    });
  } catch (error) {
    console.error("Error updating FIR report:", error);
    res.status(500).json({
      success: false,
      message: "Error updating FIR report"
    });
  }
});

// GET /api/police/statistics - Get police dashboard statistics
router.get("/statistics", (req, res) => {
  try {
    const stats = {
      totalTourists: dummyTourists.length,
      activeTourists: dummyTourists.filter(t => t.status === 'active').length,
      activeSOSAlerts: dummySOSAlerts.filter(a => a.status === 'active').length,
      totalFIRReports: dummyFIRReports.length,
      pendingFIRReports: dummyFIRReports.filter(f => f.status === 'pending').length,
      resolvedFIRReports: dummyFIRReports.filter(f => f.status === 'resolved').length,
      underInvestigationFIRReports: dummyFIRReports.filter(f => f.status === 'under_investigation').length,
      averageResponseTime: "6.5 minutes",
      crimeTypes: {
        theft: dummyFIRReports.filter(f => f.crimeType === 'Theft').length,
        fraud: dummyFIRReports.filter(f => f.crimeType === 'Fraud').length,
        harassment: dummyFIRReports.filter(f => f.crimeType === 'Harassment').length,
        assault: dummyFIRReports.filter(f => f.crimeType === 'Assault').length,
        lostProperty: dummyFIRReports.filter(f => f.crimeType === 'Lost Property').length
      }
    };
    
    res.json({
      success: true,
      statistics: stats
    });
  } catch (error) {
    console.error("Error fetching statistics:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching statistics data"
    });
  }
});

// GET /api/police/notifications - Get recent notifications
router.get("/notifications", (req, res) => {
  try {
    const notifications = [
      {
        id: "N001",
        type: "sos",
        title: "New SOS Alert",
        message: "SOS from Sarah Johnson at Shivajinagar, Pune",
        timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        unread: true,
        priority: "high"
      },
      {
        id: "N002",
        type: "fir",
        title: "New FIR Report",
        message: "FIR #FIR/2024/001 registered for Theft",
        timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
        unread: true,
        priority: "medium"
      },
      {
        id: "N003",
        type: "tourist",
        title: "Tourist Location Update",
        message: "Michael Chen moved to Koregaon Park",
        timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
        unread: false,
        priority: "low"
      },
      {
        id: "N004",
        type: "sos",
        title: "SOS Alert Resolved",
        message: "SOS from Emma Rodriguez has been resolved",
        timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
        unread: false,
        priority: "medium"
      },
      {
        id: "N005",
        type: "fir",
        title: "FIR Report Updated",
        message: "FIR #FIR/2024/002 status changed to Resolved",
        timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
        unread: false,
        priority: "low"
      }
    ];
    
    res.json({
      success: true,
      notifications,
      unreadCount: notifications.filter(n => n.unread).length
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching notifications data"
    });
  }
});

module.exports = router;
