import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { performMockEKYC } from '../services/ekycService';
import AadhaarCardSelector from './AadhaarCardSelector';
import CameraCapture from './CameraCapture';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    dateOfBirth: '',
    gender: '',
    password: '',
    confirmPassword: '',
    aadhaarNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEKYCInProgress, setIsEKYCInProgress] = useState(false);
  const [showAadhaarSelector, setShowAadhaarSelector] = useState(false);
  const [selectedAadhaarData, setSelectedAadhaarData] = useState(null);
  const [showCameraCapture, setShowCameraCapture] = useState(false);
  const [cameraType, setCameraType] = useState('');
  const [idProofFrontPhoto, setIdProofFrontPhoto] = useState(null);
  const [idProofBackPhoto, setIdProofBackPhoto] = useState(null);
  
  const { register, error, setError } = useAuth();

  const handleAadhaarCardSelect = () => {
    setShowAadhaarSelector(true);
  };

  const handleAadhaarSelected = (aadhaarData) => {
    setSelectedAadhaarData(aadhaarData);
    setFormData(prev => ({
      ...prev,
      aadhaarNumber: aadhaarData.aadhaarId
    }));
    setShowAadhaarSelector(false);
  };

  const handleCloseAadhaarSelector = () => {
    setShowAadhaarSelector(false);
  };

  const handleCameraCapture = (type) => {
    setCameraType(type);
    setShowCameraCapture(true);
  };

  const handleCloseCameraCapture = () => {
    setShowCameraCapture(false);
    setCameraType('');
  };

  const handlePhotoCaptured = (photoData) => {
    if (cameraType === 'front') {
      setIdProofFrontPhoto(photoData);
    } else if (cameraType === 'back') {
      setIdProofBackPhoto(photoData);
    }
    setShowCameraCapture(false);
    setCameraType('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (error) {
      setError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.mobile) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      newErrors.mobile = 'Please enter a valid 10-digit mobile number';
    }
    
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (age < 18) {
        newErrors.dateOfBirth = 'You must be at least 18 years old';
      } else if (age > 100) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
      }
    }
    
    if (!formData.gender) {
      newErrors.gender = 'Gender is required';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.aadhaarNumber) {
      newErrors.aadhaarNumber = 'Aadhaar number is required';
    } else if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      newErrors.aadhaarNumber = 'Please enter a valid 12-digit Aadhaar number';
    }
    
    if (!idProofFrontPhoto) {
      newErrors.idProofFrontPhoto = 'ID proof front photo is required';
    }
    
    if (!idProofBackPhoto) {
      newErrors.idProofBackPhoto = 'ID proof back photo is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // First, perform eKYC verification
      setIsEKYCInProgress(true);
      const ekycResult = await performMockEKYC(formData.aadhaarNumber);
      setIsEKYCInProgress(false);
      
      if (!ekycResult.success) {
        setErrors({ submit: ekycResult.message });
        setIsLoading(false);
        return;
      }
      
      // If eKYC is successful, proceed with registration
      const result = await register(
        formData.name, 
        formData.email, 
        formData.password,
        formData.mobile,
        formData.dateOfBirth,
        formData.gender,
        formData.aadhaarNumber,
        ekycResult.verificationData,
        selectedAadhaarData, // Send Aadhaar card data from DigiLocker
        idProofFrontPhoto, // Send ID proof front photo
        idProofBackPhoto   // Send ID proof back photo
      );
      
      if (!result.success) {
        setErrors({ submit: result.message });
      }
    } catch (error) {
      setErrors({ submit: 'Registration failed. Please try again.' });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
            />
            {errors.name && <div className="error-message">{errors.name}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              className="form-control"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="Enter your 10-digit mobile number"
              maxLength="10"
            />
            {errors.mobile && <div className="error-message">{errors.mobile}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              className="form-control"
              value={formData.dateOfBirth}
              onChange={handleChange}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.dateOfBirth && <div className="error-message">{errors.dateOfBirth}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="gender">Gender</label>
            <select
              id="gender"
              name="gender"
              className="form-control"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <div className="error-message">{errors.gender}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-control"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="form-control"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="aadhaarNumber">Aadhaar Number</label>
            <div className="aadhaar-input-group">
              <input
                type="text"
                id="aadhaarNumber"
                name="aadhaarNumber"
                className="form-control"
                value={formData.aadhaarNumber}
                onChange={handleChange}
                placeholder="Enter your 12-digit Aadhaar number"
                maxLength="12"
                readOnly={selectedAadhaarData ? true : false}
              />
              <button
                type="button"
                className="btn btn-secondary digilocker-btn"
                onClick={handleAadhaarCardSelect}
              >
                {selectedAadhaarData ? '✓ From DigiLocker' : 'Fetch from DigiLocker'}
              </button>
            </div>
            {selectedAadhaarData && (
              <div className="success-message">
                ✓ Aadhaar card fetched from DigiLocker successfully
              </div>
            )}
            {errors.aadhaarNumber && <div className="error-message">{errors.aadhaarNumber}</div>}
          </div>
          
          <div className="form-group">
            <label>ID Proof Front Photo</label>
            <div className="photo-capture-section">
              {idProofFrontPhoto ? (
                <div className="captured-photo-preview">
                  <img src={idProofFrontPhoto.base64} alt="ID Front" className="photo-thumbnail" />
                  <div className="photo-info">
                    <p><strong>Format:</strong> {idProofFrontPhoto.format}</p>
                    <p><strong>Size:</strong> {idProofFrontPhoto.size}</p>
                    <p><strong>Captured:</strong> {new Date(idProofFrontPhoto.capturedAt).toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleCameraCapture('front')}
                  >
                    📷 Retake Front Photo
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary photo-capture-btn"
                  onClick={() => handleCameraCapture('front')}
                >
                  📷 Capture ID Front Photo
                </button>
              )}
            </div>
            {errors.idProofFrontPhoto && <div className="error-message">{errors.idProofFrontPhoto}</div>}
          </div>
          
          <div className="form-group">
            <label>ID Proof Back Photo</label>
            <div className="photo-capture-section">
              {idProofBackPhoto ? (
                <div className="captured-photo-preview">
                  <img src={idProofBackPhoto.base64} alt="ID Back" className="photo-thumbnail" />
                  <div className="photo-info">
                    <p><strong>Format:</strong> {idProofBackPhoto.format}</p>
                    <p><strong>Size:</strong> {idProofBackPhoto.size}</p>
                    <p><strong>Captured:</strong> {new Date(idProofBackPhoto.capturedAt).toLocaleString()}</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleCameraCapture('back')}
                  >
                    📷 Retake Back Photo
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary photo-capture-btn"
                  onClick={() => handleCameraCapture('back')}
                >
                  📷 Capture ID Back Photo
                </button>
              )}
            </div>
            {errors.idProofBackPhoto && <div className="error-message">{errors.idProofBackPhoto}</div>}
          </div>
          
          {errors.submit && <div className="error-message">{errors.submit}</div>}
          {error && <div className="error-message">{error}</div>}
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={isLoading || isEKYCInProgress}
            style={{ width: '100%', marginBottom: '20px' }}
          >
            {isEKYCInProgress ? 'Performing eKYC Verification...' : 
             isLoading ? 'Creating Account...' : 'Register & Verify'}
          </button>
        </form>
        
        <p style={{ textAlign: 'center', color: '#666' }}>
          Already have an account? <Link to="/login" style={{ color: '#667eea' }}>Login here</Link>
        </p>
      </div>
      
      {showAadhaarSelector && (
        <AadhaarCardSelector
          onAadhaarSelected={handleAadhaarSelected}
          onClose={handleCloseAadhaarSelector}
        />
      )}
      
      {showCameraCapture && (
        <CameraCapture
          onCapture={handlePhotoCaptured}
          onClose={handleCloseCameraCapture}
          title={`Capture ID Proof ${cameraType === 'front' ? 'Front' : 'Back'} Photo`}
          type={cameraType}
        />
      )}
    </div>
  );
};

export default Register;
