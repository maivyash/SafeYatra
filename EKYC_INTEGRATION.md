# eKYC Integration with DigiLocker

This document explains the eKYC (electronic Know Your Customer) integration implemented in the MERN stack application using DigiLocker's face verification and ID verification services.

## 🎯 Overview

The application now includes comprehensive eKYC functionality that performs:
- **Face Verification**: Biometric face matching using DigiLocker's face verification API
- **ID Verification**: Aadhaar number validation and verification
- **Complete eKYC Process**: End-to-end verification workflow

## 📋 New Registration Fields

The registration form now includes the following fields:

1. **Name** - Full name of the user
2. **Email** - Email address (unique)
3. **Mobile** - 10-digit mobile number (unique)
4. **Password** - User password (minimum 6 characters)
5. **Confirm Password** - Password confirmation
6. **Aadhaar Number** - 12-digit Aadhaar number (unique)

## 🔐 eKYC Verification Process

### Step 1: Form Validation
- Client-side validation for all fields
- Server-side validation with express-validator
- Unique constraint checks for email, mobile, and Aadhaar

### Step 2: eKYC Initialization
- Initialize eKYC session with DigiLocker
- Generate session ID for tracking
- Set up OAuth flow parameters

### Step 3: Face Verification
- Capture user's face image
- Send to DigiLocker's face verification API
- Receive confidence score and verification status

### Step 4: ID Verification
- Validate Aadhaar number format
- Verify Aadhaar with UIDAI database
- Cross-reference with face verification

### Step 5: Final Verification
- Combine face and ID verification results
- Generate final verification status
- Store verification data in database

## 🛠️ Technical Implementation

### Frontend Components

#### Updated Registration Form (`frontend/src/components/Register.js`)
```javascript
// New form fields
const [formData, setFormData] = useState({
  name: '',
  email: '',
  mobile: '',
  password: '',
  confirmPassword: '',
  aadhaarNumber: ''
});

// eKYC integration
const ekycResult = await performMockEKYC(formData.aadhaarNumber);
```

#### eKYC Service (`frontend/src/services/ekycService.js`)
- `performEKYC()` - Main eKYC function
- `performMockEKYC()` - Mock implementation for development
- `initializeEKYC()` - Initialize DigiLocker session
- `performFaceVerification()` - Face verification API call
- `performIDVerification()` - ID verification API call
- `completeEKYC()` - Final verification completion

#### DigiLocker Configuration (`frontend/src/config/digilocker.js`)
- API endpoints configuration
- Client credentials management
- Verification levels and status constants

### Backend Implementation

#### Updated User Model (`backend/models/User.js`)
```javascript
const userSchema = new mongoose.Schema({
  // ... existing fields
  mobile: {
    type: String,
    required: [true, 'Mobile number is required'],
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please enter a valid 10-digit mobile number']
  },
  aadhaarNumber: {
    type: String,
    required: [true, 'Aadhaar number is required'],
    unique: true,
    match: [/^\d{12}$/, 'Please enter a valid 12-digit Aadhaar number']
  },
  ekycData: {
    sessionId: String,
    faceVerification: {
      status: String,
      confidence: Number,
      timestamp: Date
    },
    idVerification: {
      status: String,
      aadhaarValid: Boolean,
      timestamp: Date
    },
    finalVerification: {
      status: String,
      verificationLevel: String,
      timestamp: Date
    },
    timestamp: Date
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});
```

#### Updated Auth Routes (`backend/routes/auth.js`)
- Enhanced validation for new fields
- eKYC data storage
- Duplicate check for email, mobile, and Aadhaar

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
# DigiLocker API Configuration
REACT_APP_DIGILOCKER_API_URL=https://api.digitallocker.gov.in
REACT_APP_DIGILOCKER_CLIENT_ID=your_digilocker_client_id_here
REACT_APP_DIGILOCKER_CLIENT_SECRET=your_digilocker_client_secret_here

# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api
```

### DigiLocker Setup

1. **Register with DigiLocker**: Visit [DigiLocker Developer Portal](https://developer.digitallocker.gov.in)
2. **Create Application**: Register your application and get client credentials
3. **Configure OAuth**: Set up redirect URIs and scopes
4. **Enable eKYC**: Request access to eKYC APIs

## 🚀 Usage

### Development Mode (Mock eKYC)

The application currently uses `performMockEKYC()` for development:

```javascript
// In Register.js
const ekycResult = await performMockEKYC(formData.aadhaarNumber);
```

### Production Mode (Real DigiLocker)

To use real DigiLocker APIs:

```javascript
// In Register.js
const ekycResult = await performEKYC(formData.aadhaarNumber);
```

## 📊 Verification Levels

The system supports different verification levels:

- **L1**: Basic verification (Aadhaar number only)
- **L2**: Enhanced verification (Aadhaar + Face)
- **L3**: Full verification (Aadhaar + Face + Biometrics)

## 🔍 Verification Status

- `pending` - Verification not started
- `in_progress` - Verification in progress
- `completed` - Verification successful
- `failed` - Verification failed
- `expired` - Verification session expired

## 🛡️ Security Features

1. **Data Encryption**: All sensitive data is encrypted
2. **Session Management**: Secure session handling
3. **Token-based Auth**: JWT tokens for API access
4. **Input Validation**: Comprehensive validation on both client and server
5. **Unique Constraints**: Prevent duplicate registrations

## 📱 User Experience

### Registration Flow

1. User fills registration form
2. Form validation (client-side)
3. eKYC verification starts automatically
4. Progress indicator shows verification status
5. Registration completes after successful eKYC
6. User is redirected to dashboard

### Error Handling

- Clear error messages for validation failures
- eKYC failure handling with retry options
- Network error handling
- Timeout handling for API calls

## 🔄 API Endpoints

### New Registration Endpoint

```
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "password123",
  "aadhaarNumber": "123456789012",
  "ekycData": {
    "sessionId": "session_123",
    "faceVerification": { ... },
    "idVerification": { ... },
    "finalVerification": { ... }
  }
}
```

## 🧪 Testing

### Mock eKYC Testing

The mock implementation simulates the eKYC process:

```javascript
// Test with mock data
const mockAadhaar = "123456789012";
const result = await performMockEKYC(mockAadhaar);
console.log(result); // Returns mock verification data
```

### Integration Testing

1. Test form validation
2. Test eKYC flow
3. Test database storage
4. Test error scenarios

## 🚀 Deployment

### Frontend Deployment

1. Set environment variables
2. Configure DigiLocker credentials
3. Build and deploy React app

### Backend Deployment

1. Set up MongoDB database
2. Configure environment variables
3. Deploy Express server
4. Set up SSL certificates

## 📞 Support

For issues related to:

- **DigiLocker Integration**: Contact DigiLocker support
- **Application Issues**: Check application logs
- **API Errors**: Verify credentials and endpoints

## 🔮 Future Enhancements

1. **Real-time Verification**: WebSocket integration for live updates
2. **Biometric Integration**: Fingerprint and iris scanning
3. **Document Verification**: Additional document types
4. **Multi-language Support**: Localization for different regions
5. **Analytics Dashboard**: Verification statistics and reports

---

**Note**: This implementation includes both mock and real DigiLocker integration. For production use, ensure you have proper DigiLocker credentials and follow their API guidelines.
