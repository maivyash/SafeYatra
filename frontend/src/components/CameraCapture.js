import React, { useState, useRef, useEffect } from 'react';

const CameraCapture = ({ onCapture, onClose, title, type }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState('');
  const [capturedImage, setCapturedImage] = useState(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setError('');
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'environment' // Use back camera if available
        }
      });
      
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Unable to access camera. Please check permissions and try again.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // Draw video frame to canvas
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Convert to base64
    const imageData = canvas.toDataURL('image/jpeg', 0.8);
    
    // Calculate file size
    const sizeInBytes = (imageData.length * 3) / 4;
    const sizeInKB = Math.round(sizeInBytes / 1024);

    const capturedData = {
      base64: imageData,
      format: 'jpeg',
      size: `${sizeInKB}KB`,
      capturedAt: new Date().toISOString(),
      type: type
    };

    setCapturedImage(capturedData);
    setIsCapturing(true);
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    setIsCapturing(false);
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="camera-capture-overlay">
      <div className="camera-capture-modal">
        <div className="camera-header">
          <h3>{title}</h3>
          <button className="close-btn" onClick={handleClose}>×</button>
        </div>
        
        <div className="camera-content">
          {error ? (
            <div className="camera-error">
              <div className="error-icon">📷</div>
              <p>{error}</p>
              <button className="btn btn-primary" onClick={startCamera}>
                Try Again
              </button>
            </div>
          ) : (
            <>
              {!capturedImage ? (
                <div className="camera-preview">
                  <div className="camera-container">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="camera-video"
                    />
                    <div className="camera-overlay">
                      <div className="capture-frame">
                        <div className="frame-corners">
                          <div className="corner top-left"></div>
                          <div className="corner top-right"></div>
                          <div className="corner bottom-left"></div>
                          <div className="corner bottom-right"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="camera-instructions">
                    <h4>Instructions:</h4>
                    <ul>
                      <li>Position the {type === 'front' ? 'front' : 'back'} of your ID card within the frame</li>
                      <li>Ensure good lighting and clear visibility</li>
                      <li>Keep the camera steady</li>
                      <li>Make sure all text is readable</li>
                    </ul>
                  </div>
                  
                  <div className="camera-controls">
                    <button className="btn btn-secondary" onClick={handleClose}>
                      Cancel
                    </button>
                    <button className="btn btn-primary capture-btn" onClick={capturePhoto}>
                      📷 Capture Photo
                    </button>
                  </div>
                </div>
              ) : (
                <div className="captured-preview">
                  <h4>Captured Photo</h4>
                  <div className="image-preview">
                    <img src={capturedImage.base64} alt="Captured ID" />
                  </div>
                  
                  <div className="image-details">
                    <p><strong>Format:</strong> {capturedImage.format}</p>
                    <p><strong>Size:</strong> {capturedImage.size}</p>
                    <p><strong>Captured:</strong> {new Date(capturedImage.capturedAt).toLocaleString()}</p>
                  </div>
                  
                  <div className="capture-actions">
                    <button className="btn btn-secondary" onClick={retakePhoto}>
                      📷 Retake
                    </button>
                    <button className="btn btn-primary" onClick={confirmCapture}>
                      ✓ Use This Photo
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Hidden canvas for photo capture */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default CameraCapture;
