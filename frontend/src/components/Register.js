import React, { useState, useEffect } from 'react';
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
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { register, error, setError } = useAuth();

  // Animation effect on component mount
  useEffect(() => {
    setIsAnimating(true);
    return () => setIsAnimating(false);
  }, []);

  const totalSteps = 4;

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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getStepTitle = (step) => {
    const titles = {
      1: 'Personal Information',
      2: 'Contact Details',
      3: 'Security Setup',
      4: 'Identity Verification'
    };
    return titles[step];
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
      <div className={`modern-register-card ${isAnimating ? 'animate-in' : ''}`}>
        {/* Header Section */}
        <div className="register-header">
          <div className="register-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M20 8V14L23 11L26 14V8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M17 11H23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 className="register-title">Join SafeYatra</h2>
          <p className="register-subtitle">Create your secure travel account</p>
        </div>

        {/* Progress Bar */}
        <div className="progress-container">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
          <div className="progress-steps">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div 
                key={i + 1} 
                className={`progress-step ${currentStep >= i + 1 ? 'active' : ''}`}
              >
                <div className="step-number">{i + 1}</div>
                <div className="step-title">{getStepTitle(i + 1)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="modern-register-form">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="form-step">
              <div className="step-header">
                <h3>Personal Information</h3>
                <p>Tell us about yourself</p>
              </div>
              
              <div className="input-group">
                <div className="input-container">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className={`modern-input ${errors.name ? 'error' : ''}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="name" className="floating-label">
                    <span className="label-icon">👤</span>
                    Full Name
                  </label>
                  <div className="input-border"></div>
                </div>
                {errors.name && (
                  <div className="error-message-modern">
                    <span className="error-icon">⚠️</span>
                    {errors.name}
                  </div>
                )}
              </div>

              <div className="input-group">
                <div className="input-container">
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    className={`modern-input ${errors.dateOfBirth ? 'error' : ''}`}
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <label htmlFor="dateOfBirth" className="floating-label">
                    <span className="label-icon">🎂</span>
                    Date of Birth
                  </label>
                  <div className="input-border"></div>
                </div>
                {errors.dateOfBirth && (
                  <div className="error-message-modern">
                    <span className="error-icon">⚠️</span>
                    {errors.dateOfBirth}
                  </div>
                )}
              </div>

              <div className="input-group">
                <div className="input-container select-container">
                  <select
                    id="gender"
                    name="gender"
                    className={`modern-select ${errors.gender ? 'error' : ''}`}
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                  <label htmlFor="gender" className="floating-label">
                    <span className="label-icon">⚥</span>
                    Gender
                  </label>
                  <div className="input-border"></div>
                </div>
                {errors.gender && (
                  <div className="error-message-modern">
                    <span className="error-icon">⚠️</span>
                    {errors.gender}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Contact Details */}
          {currentStep === 2 && (
            <div className="form-step">
              <div className="step-header">
                <h3>Contact Details</h3>
                <p>How can we reach you?</p>
              </div>
              
              <div className="input-group">
                <div className="input-container">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`modern-input ${errors.email ? 'error' : ''}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="email" className="floating-label">
                    <span className="label-icon">📧</span>
                    Email Address
                  </label>
                  <div className="input-border"></div>
                </div>
                {errors.email && (
                  <div className="error-message-modern">
                    <span className="error-icon">⚠️</span>
                    {errors.email}
                  </div>
                )}
              </div>

              <div className="input-group">
                <div className="input-container">
                  <input
                    type="tel"
                    id="mobile"
                    name="mobile"
                    className={`modern-input ${errors.mobile ? 'error' : ''}`}
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder=" "
                    maxLength="10"
                    required
                  />
                  <label htmlFor="mobile" className="floating-label">
                    <span className="label-icon">📱</span>
                    Mobile Number
                  </label>
                  <div className="input-border"></div>
                </div>
                {errors.mobile && (
                  <div className="error-message-modern">
                    <span className="error-icon">⚠️</span>
                    {errors.mobile}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Security Setup */}
          {currentStep === 3 && (
            <div className="form-step">
              <div className="step-header">
                <h3>Security Setup</h3>
                <p>Create a secure password</p>
              </div>
              
              <div className="input-group">
                <div className="input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`modern-input ${errors.password ? 'error' : ''}`}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="password" className="floating-label">
                    <span className="label-icon">🔒</span>
                    Password
                  </label>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    tabIndex="-1"
                  >
                    {showPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  <div className="input-border"></div>
                </div>
                {errors.password && (
                  <div className="error-message-modern">
                    <span className="error-icon">⚠️</span>
                    {errors.password}
                  </div>
                )}
              </div>

              <div className="input-group">
                <div className="input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`modern-input ${errors.confirmPassword ? 'error' : ''}`}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder=" "
                    required
                  />
                  <label htmlFor="confirmPassword" className="floating-label">
                    <span className="label-icon">🔐</span>
                    Confirm Password
                  </label>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={toggleConfirmPasswordVisibility}
                    tabIndex="-1"
                  >
                    {showConfirmPassword ? (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </button>
                  <div className="input-border"></div>
                </div>
                {errors.confirmPassword && (
                  <div className="error-message-modern">
                    <span className="error-icon">⚠️</span>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Identity Verification */}
          {currentStep === 4 && (
            <div className="form-step">
              <div className="step-header">
                <h3>Identity Verification</h3>
                <p>Verify your identity for secure travel</p>
              </div>
              
              <div className="input-group">
                <div className="input-container">
                  <input
                    type="text"
                    id="aadhaarNumber"
                    name="aadhaarNumber"
                    className={`modern-input ${errors.aadhaarNumber ? 'error' : ''}`}
                    value={formData.aadhaarNumber}
                    onChange={handleChange}
                    placeholder=" "
                    maxLength="12"
                    readOnly={selectedAadhaarData ? true : false}
                    required
                  />
                  <label htmlFor="aadhaarNumber" className="floating-label">
                    <span className="label-icon">🆔</span>
                    Aadhaar Number
                  </label>
                  <button
                    type="button"
                    className="digilocker-btn"
                    onClick={handleAadhaarCardSelect}
                  >
                    {selectedAadhaarData ? '✓' : '🔗'}
                  </button>
                  <div className="input-border"></div>
                </div>
                {selectedAadhaarData && (
                  <div className="success-message-modern">
                    <span className="success-icon">✓</span>
                    Aadhaar card fetched from DigiLocker successfully
                  </div>
                )}
                {errors.aadhaarNumber && (
                  <div className="error-message-modern">
                    <span className="error-icon">⚠️</span>
                    {errors.aadhaarNumber}
                  </div>
                )}
              </div>

              <div className="photo-capture-grid">
                <div className="photo-capture-item">
                  <h4>ID Proof Front</h4>
                  {idProofFrontPhoto ? (
                    <div className="captured-photo-modern">
                      <img src={idProofFrontPhoto.base64} alt="ID Front" className="photo-thumbnail-modern" />
                      <button
                        type="button"
                        className="retake-btn"
                        onClick={() => handleCameraCapture('front')}
                      >
                        🔄 Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="photo-capture-btn-modern"
                      onClick={() => handleCameraCapture('front')}
                    >
                      <span className="capture-icon">📷</span>
                      <span>Capture Front</span>
                    </button>
                  )}
                  {errors.idProofFrontPhoto && (
                    <div className="error-message-modern">
                      <span className="error-icon">⚠️</span>
                      {errors.idProofFrontPhoto}
                    </div>
                  )}
                </div>

                <div className="photo-capture-item">
                  <h4>ID Proof Back</h4>
                  {idProofBackPhoto ? (
                    <div className="captured-photo-modern">
                      <img src={idProofBackPhoto.base64} alt="ID Back" className="photo-thumbnail-modern" />
                      <button
                        type="button"
                        className="retake-btn"
                        onClick={() => handleCameraCapture('back')}
                      >
                        🔄 Retake
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="photo-capture-btn-modern"
                      onClick={() => handleCameraCapture('back')}
                    >
                      <span className="capture-icon">📷</span>
                      <span>Capture Back</span>
                    </button>
                  )}
                  {errors.idProofBackPhoto && (
                    <div className="error-message-modern">
                      <span className="error-icon">⚠️</span>
                      {errors.idProofBackPhoto}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Error Messages */}
          {errors.submit && (
            <div className="error-message-modern submit-error">
              <span className="error-icon">❌</span>
              {errors.submit}
            </div>
          )}
          {error && (
            <div className="error-message-modern submit-error">
              <span className="error-icon">❌</span>
              {error}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="form-navigation">
            {currentStep > 1 && (
              <button
                type="button"
                className="nav-btn prev-btn"
                onClick={prevStep}
              >
                ← Previous
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                className="nav-btn next-btn"
                onClick={nextStep}
              >
                Next →
              </button>
            ) : (
              <button
                type="submit"
                className={`modern-submit-btn ${isLoading || isEKYCInProgress ? 'loading' : ''}`}
                disabled={isLoading || isEKYCInProgress}
              >
                <span className="btn-content">
                  {isEKYCInProgress ? (
                    <>
                      <div className="spinner"></div>
                      Verifying Identity...
                    </>
                  ) : isLoading ? (
                    <>
                      <div className="spinner"></div>
                      Creating Account...
                    </>
                  ) : (
                    <>
                      <span className="btn-icon">🚀</span>
                      Complete Registration
                    </>
                  )}
                </span>
                <div className="btn-ripple"></div>
              </button>
            )}
          </div>
        </form>

        {/* Footer Section */}
        <div className="register-footer">
          <div className="divider">
            <span>or</span>
          </div>
          
          <p className="login-prompt">
            Already have an account?{" "}
            <Link to="/login" className="login-link">
              Sign In
              <span className="link-arrow">→</span>
            </Link>
          </p>
        </div>
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
