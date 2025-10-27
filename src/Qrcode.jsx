import React, { useState, useEffect } from "react";
import "./Qrcode.css";
import { QRCodeCanvas } from "qrcode.react";

export const Qrcode = () => {
  const [activeTab, setActiveTab] = useState("url");
  const [activeSection, setActiveSection] = useState("content");
  const [inputValue, setInputValue] = useState("");
  const [qrColor, setQrColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [logoFile, setLogoFile] = useState(null);
  const [qrSize, setQrSize] = useState(250);
  const [eyeRadius, setEyeRadius] = useState(0);
  const [validationError, setValidationError] = useState("");

  // Apply border radius to canvas after it renders
  useEffect(() => {
    const canvas = document.getElementById("qrCodeCanvas");
    if (canvas) {
      canvas.style.borderRadius = `${eyeRadius}px`;
    }
  }, [eyeRadius]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setInputValue("");
    setValidationError("");
  };

  const validateInput = (value, type) => {
    switch (type) {
      case "url":
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (value && !urlPattern.test(value)) {
          setValidationError("Please enter a valid URL (e.g., https://example.com)");
          return false;
        }
        break;
      case "email":
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailPattern.test(value)) {
          setValidationError("Please enter a valid email address");
          return false;
        }
        break;
      case "phone":
        const phonePattern = /^[\d\s\+\-\(\)]+$/;
        if (value && !phonePattern.test(value)) {
          setValidationError("Please enter a valid phone number");
          return false;
        }
        break;
      default:
        break;
    }
    setValidationError("");
    return true;
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    validateInput(value, activeTab);
  };

  const getPlaceholder = () => {
    switch (activeTab) {
      case "url":
        return "https://www.example.com";
      case "text":
        return "Enter any text you want to encode";
      case "email":
        return "example@email.com";
      case "phone":
        return "+91 1234567890";
      default:
        return "";
    }
  };

  const getInputType = () => {
    switch (activeTab) {
      case "url":
        return "url";
      case "email":
        return "email";
      case "phone":
        return "tel";
      default:
        return "text";
    }
  };

  const handleSectionClick = (section) => setActiveSection(section);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) setLogoFile(URL.createObjectURL(file));
  };

  const getQRValue = () => inputValue || "";

  const downloadQr = () => {
    const canvas = document.getElementById("qrCodeCanvas");
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = "QR_CODE.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="app-container">
      <div className="gradient-bg"></div>
      
      <header className="header">
        <div className="logo-container">
          <h1 className="logo">QR Code Generator</h1>
        </div>
        <nav className="nav-links">
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Pricing</a>
          <a href="#" className="nav-link contact-btn">Get Started</a>
        </nav>
      </header>

      <div className="hero-section">
        <h2 className="hero-title">Create Beautiful QR Codes</h2>
        <p className="hero-subtitle">Design custom QR codes in seconds with our powerful generator</p>
      </div>

      <div className="tabs-container">
        {["url", "text", "email", "phone"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            <span className="tab-label">{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>

      <div className="main-container">
        <div className="content-card">
          <div className="left-panel">
            <div className="panel-header">
              <h3 className="panel-title">Customize Your QR</h3>
              <div className="decorative-line"></div>
            </div>

            <div className="section-nav">
              {["content", "colors", "logo", "custom"].map((section) => (
                <button
                  key={section}
                  className={`section-btn ${activeSection === section ? "active" : ""}`}
                  onClick={() => handleSectionClick(section)}
                >
                  <span className="section-label">
                    {section === "content"
                      ? "Content"
                      : section === "colors"
                      ? "Colors"
                      : section === "logo"
                      ? "Logo"
                      : "Design"}
                  </span>
                  {activeSection === section && <span className="active-indicator"></span>}
                </button>
              ))}
            </div>

            <div className="section-content">
              {activeSection === "content" && (
                <div className="content-form">
                  <div className="form-group">
                    <label className="form-label">
                      Enter your {activeTab}
                    </label>
                    <input
                      type={getInputType()}
                      className={`form-input ${validationError ? "input-error" : ""}`}
                      placeholder={getPlaceholder()}
                      value={inputValue}
                      onChange={handleInputChange}
                    />
                    {validationError && (
                      <p className="error-message">{validationError}</p>
                    )}
                  </div>
                </div>
              )}

              {activeSection === "colors" && (
                <div className="content-form">
                  <div className="color-picker-group">
                    <div className="color-picker-item">
                      <label className="form-label">QR Code Color</label>
                      <div className="color-input-wrapper">
                        <input
                          type="color"
                          className="color-input"
                          value={qrColor}
                          onChange={(e) => setQrColor(e.target.value)}
                        />
                        <span className="color-value">{qrColor}</span>
                      </div>
                    </div>
                    <div className="color-picker-item">
                      <label className="form-label">Background Color</label>
                      <div className="color-input-wrapper">
                        <input
                          type="color"
                          className="color-input"
                          value={bgColor}
                          onChange={(e) => setBgColor(e.target.value)}
                        />
                        <span className="color-value">{bgColor}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "logo" && (
                <div className="content-form">
                  <div className="form-group">
                    <label className="form-label">Upload Your Logo</label>
                    <div className="file-upload-wrapper">
                      <input
                        type="file"
                        id="logo-upload"
                        className="file-input"
                        accept="image/*"
                        onChange={handleLogoUpload}
                      />
                      <label htmlFor="logo-upload" className="file-upload-btn">
                        Choose Image
                      </label>
                    </div>
                    {logoFile && (
                      <div className="logo-preview">
                        <img src={logoFile} alt="Logo Preview" />
                        <p className="preview-label">Preview</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeSection === "custom" && (
                <div className="content-form">
                  <div className="form-group">
                    <label className="form-label">
                      QR Code Size: <span className="value-badge">{qrSize}px</span>
                    </label>
                    <input
                      type="range"
                      className="range-slider"
                      value={qrSize}
                      min="100"
                      max="500"
                      onChange={(e) => setQrSize(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Corner Radius: <span className="value-badge">{eyeRadius}px</span>
                    </label>
                    <input
                      type="range"
                      className="range-slider"
                      value={eyeRadius}
                      min="0"
                      max="50"
                      onChange={(e) => setEyeRadius(parseInt(e.target.value))}
                    />
                  </div>
                  <div className="info-box">
                    <p>More customization options coming soon!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="right-panel">
            <div className="qr-preview-container">
              <div className="qr-canvas-wrapper">
                <QRCodeCanvas
                  id="qrCodeCanvas"
                  value={getQRValue()}
                  size={qrSize}
                  fgColor={qrColor}
                  bgColor={bgColor}
                  imageSettings={
                    logoFile
                      ? { src: logoFile, x: null, y: null, height: 50, width: 50, excavate: true }
                      : undefined
                  }
                />
              </div>
              <p className="preview-label">Live Preview</p>
              <button className="download-btn" onClick={downloadQr}>
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer">
        <p>QR Code Generator © 2025</p>
      </footer>
    </div>
  );
};

export default Qrcode;
