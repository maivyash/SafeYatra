# Police Dashboard - Tourist Safety Monitoring System

## Overview
A comprehensive police control dashboard designed for monitoring tourist safety, managing SOS alerts, and handling FIR reports in real-time. This system provides law enforcement with powerful tools to ensure tourist safety and efficient incident management.

## Features

### 🗺️ Real-time Map Integration
- **Live Tourist Tracking**: Monitor all tourists in your jurisdiction with real-time location updates
- **Police Station Locations**: View all police stations with contact details and jurisdictions
- **SOS Alert Markers**: Visual indicators for active SOS alerts with priority levels
- **Safety Zone Overlays**: Polygon-based safety areas with crime statistics and safety scores
- **Interactive Markers**: Click on any marker for detailed information

### 👥 Tourist Management
- **Complete Profiles**: View tourist details including nationality, passport info, emergency contacts
- **Status Tracking**: Monitor active/inactive status and last seen timestamps
- **Location History**: Track tourist movements and itinerary
- **Emergency Contacts**: Quick access to emergency contact information
- **Search & Filter**: Find tourists by name, location, or status

### 🚨 SOS Alert System
- **Instant Notifications**: Real-time alerts for SOS requests
- **Priority Levels**: High, medium, and low priority classification
- **Officer Assignment**: Assign specific officers to handle alerts
- **Response Tracking**: Monitor response times and resolution status
- **Location Details**: Precise coordinates and address information

### 📋 FIR Report Management
- **Digital Registration**: Create and manage FIR reports digitally
- **Case Tracking**: Monitor case status from pending to resolved
- **Evidence Management**: Attach and organize case evidence
- **Officer Assignment**: Assign cases to specific officers
- **Status Updates**: Real-time status changes and notifications

### 🔔 Notification System
- **Real-time Alerts**: Instant notifications for all critical events
- **Priority-based**: Different notification types with priority levels
- **Read/Unread Tracking**: Manage notification status
- **Event Categorization**: Organize notifications by type (SOS, FIR, Tourist updates)

### 📊 Analytics & Statistics
- **Crime Statistics**: Comprehensive crime data and patterns
- **Response Time Analytics**: Track average response times
- **Area Safety Scores**: Safety ratings for different zones
- **Trend Analysis**: Historical data and pattern recognition

## Demo Data

The system includes comprehensive dummy data for demonstration:

### Tourists (8 Active)
- **Sarah Johnson** (American) - Shivajinagar, Pune
- **Michael Chen** (Chinese) - Koregaon Park, Pune
- **Emma Rodriguez** (Spanish) - Bund Garden, Pune
- **David Kim** (Korean) - Kothrud, Pune
- **Lisa Anderson** (Australian) - Viman Nagar, Pune
- **Ahmed Hassan** (Egyptian) - Kondhwa, Pune
- **Maria Garcia** (Mexican) - Pimpri, Pune
- **James Wilson** (British) - Wakad, Pune

Each tourist includes:
- Complete profile with avatar
- Real-time location coordinates
- Emergency contact information
- Passport details and nationality
- Hotel information and itinerary
- Last seen timestamps

### SOS Alerts (3 Active/Resolved)
- **Active Alert**: Sarah Johnson - Lost and needs help finding hotel
- **Active Alert**: Emma Rodriguez - Medical emergency requiring ambulance
- **Resolved Alert**: Lisa Anderson - Wallet stolen, case resolved

### FIR Reports (5 Cases)
- **FIR/2024/001**: Theft case by Michael Chen (Under Investigation)
- **FIR/2024/002**: Fraud case by Sarah Johnson (Resolved)
- **FIR/2024/003**: Harassment case by Emma Rodriguez (Under Investigation)
- **FIR/2024/004**: Assault case by David Kim (Pending)
- **FIR/2024/005**: Lost Property case by Lisa Anderson (Resolved)

### Police Stations (15 Locations)
Complete coverage of Pune with stations in:
- Shivajinagar, Koregaon Park, Bund Garden
- Kothrud, Hadapsar, Viman Nagar
- Pimpri, Chinchwad, Hinjewadi
- Wakad, Yerawada, Dighi, Khadki
- And more...

### Safety Areas (30+ Zones)
Polygon-based safety zones covering:
- All major areas of Pune
- Crime statistics and safety scores
- Population data and police presence
- CCTV density information
- Last incident dates

## Technology Stack

### Frontend
- **React.js**: Modern UI framework
- **Leaflet Maps**: Interactive mapping solution
- **Socket.io**: Real-time communication
- **Lucide React**: Modern icon library
- **CSS3**: Advanced styling with gradients and animations

### Backend
- **Express.js**: Node.js web framework
- **Socket.io**: Real-time bidirectional communication
- **MongoDB**: Database for data persistence
- **RESTful APIs**: Clean API design
- **CORS**: Cross-origin resource sharing

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd SIH
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the backend server**
   ```bash
   cd ../backend
   npm start
   ```

5. **Start the frontend development server**
   ```bash
   cd ../frontend
   npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Police Dashboard: http://localhost:3000/police-dashboard
   - Demo Page: http://localhost:3000/demo

## API Endpoints

### Police Dashboard APIs

#### Tourists
- `GET /api/police/tourists` - Get all tourists
- `GET /api/police/tourists/:id` - Get specific tourist

#### SOS Alerts
- `GET /api/police/sos-alerts` - Get all SOS alerts
- `POST /api/police/sos-alerts` - Create new SOS alert
- `PUT /api/police/sos-alerts/:id` - Update SOS alert

#### FIR Reports
- `GET /api/police/fir-reports` - Get all FIR reports
- `GET /api/police/fir-reports/:id` - Get specific FIR report
- `POST /api/police/fir-reports` - Create new FIR report
- `PUT /api/police/fir-reports/:id` - Update FIR report

#### Statistics & Notifications
- `GET /api/police/statistics` - Get dashboard statistics
- `GET /api/police/notifications` - Get recent notifications

## Usage

### For Police Officers

1. **Access the Dashboard**
   - Navigate to `/police-dashboard` after logging in
   - View real-time statistics and alerts

2. **Monitor Tourists**
   - Use the left panel to view tourist list
   - Click on tourists to view detailed information
   - Use search and filter options

3. **Handle SOS Alerts**
   - View active alerts in the notifications panel
   - Click on map markers for alert details
   - Assign officers and update status

4. **Manage FIR Reports**
   - View all FIR reports in the left panel
   - Click on reports for detailed information
   - Update case status and add evidence

5. **Use the Map**
   - Zoom and pan to different areas
   - Click on markers for information
   - View safety zones and police stations

### For Tourists

1. **Access Tourist Dashboard**
   - Navigate to `/dashboard` after logging in
   - View your location and nearby users
   - Access SOS and emergency features

2. **Emergency Features**
   - Use SOS button for emergencies
   - Share live location with authorities
   - View nearby police stations

## Security Features

- **Authentication Required**: All police dashboard features require user authentication
- **Protected Routes**: Sensitive operations are protected by authentication middleware
- **Data Validation**: Input validation on all API endpoints
- **Error Handling**: Comprehensive error handling and logging

## Future Enhancements

- **Mobile App**: Native mobile applications for police officers
- **AI Integration**: Machine learning for crime pattern analysis
- **Advanced Analytics**: More detailed reporting and analytics
- **Integration**: Integration with existing police management systems
- **Multi-language Support**: Support for multiple languages
- **Offline Capability**: Offline functionality for areas with poor connectivity

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a demonstration system with dummy data. In a production environment, proper security measures, data validation, and real-time data integration would be implemented.
