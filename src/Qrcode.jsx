import React, { useState } from "react";
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

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setInputValue("");
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
      <header className="header">
        <h2 className="logo">QR Generator</h2>
        <nav>
          <a href="#">About</a>
          <a href="#">Contact</a>
          <a href="#">Language</a>
        </nav>
      </header>

      <div className="tabs">
        {["url", "text", "email", "phone"].map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => handleTabClick(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      <div className="main-box">
        <div className="left-section">
          <div className="section-buttons">
            {["content", "colors", "logo", "custom"].map((section) => (
              <button
                key={section}
                className={`section-btn ${
                  activeSection === section ? "active" : ""
                }`}
                onClick={() => handleSectionClick(section)}
              >
                {section === "content"
                  ? "Enter Content"
                  : section === "colors"
                  ? "Set Colors"
                  : section === "logo"
                  ? "Add Logo"
                  : "Customize Design"}
              </button>
            ))}
          </div>

          <div className="section-content">
            {activeSection === "content" && (
              <div className="slide">
                <label>Enter {activeTab}:</label>
                <input
                  type="text"
                  placeholder={`Enter ${activeTab} content`}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
            )}

            {activeSection === "colors" && (
              <div className="slide">
                <label>Foreground Color:</label>
                <input
                  type="color"
                  value={qrColor}
                  onChange={(e) => setQrColor(e.target.value)}
                />
                <label>Background Color:</label>
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                />
              </div>
            )}

            {activeSection === "logo" && (
              <div className="slide">
                <label>Upload Logo:</label>
                <input type="file" accept="image/*" onChange={handleLogoUpload} />
                {logoFile && (
                  <img
                    src={logoFile}
                    alt="Logo Preview"
                    style={{ width: "80px", marginTop: "10px" }}
                  />
                )}
              </div>
            )}

            {activeSection === "custom" && (
              <div className="slide">
                <label>QR Code Size (px):</label>
                <input
                  type="number"
                  value={qrSize}
                  min="100"
                  max="500"
                  onChange={(e) => setQrSize(parseInt(e.target.value))}
                />
                <label>Eye Radius (px):</label>
                <input
                  type="number"
                  value={eyeRadius}
                  min="0"
                  max="50"
                  onChange={(e) => setEyeRadius(parseInt(e.target.value))}
                />
                <p style={{ color: "#888", marginTop: "10px" }}>
                  More customization options coming soon ⚙️
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="right-section">
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
          <p className="preview-text">QR Preview</p>
          <button className="dbtn" onClick={downloadQr}>
            Download QR
          </button>
        </div>
      </div>

      <footer className="footer">QR Generator</footer>
    </div>
  );
};

export default Qrcode;
