import React, { useState, useEffect, useRef } from "react";
import "./index.css";
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

  // Preview animation ref
  const previewRef = useRef(null);

  const triggerPreviewAnimation = () => {
    const el = previewRef.current;
    if (!el) return;
    el.classList.remove("preview-animate");
    // force reflow to restart animation
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    void el.offsetWidth;
    el.classList.add("preview-animate");
  };

  // trigger preview animation when important inputs change (visual feedback only)
  useEffect(() => {
    // small guard: only animate after initial mount
    if (previewRef.current) triggerPreviewAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue, qrColor, bgColor, logoFile, qrSize]);

  const handleTabClick = (tab, e) => {
    setActiveTab(tab);
    // when user picks a top tab (URL/Text/Email/Phone), auto-open the Content section
    setActiveSection('content');
    setInputValue("");
    setValidationError("");

    // small micro-interaction: add temporary class to clicked button
    try {
      const btn = e && e.currentTarget;
      if (btn) {
        btn.classList.remove('tab-press');
        // force reflow to restart animation
        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        void btn.offsetWidth;
        btn.classList.add('tab-press');
        // cleanup after animation
        setTimeout(() => btn.classList.remove('tab-press'), 300);
      }
    } catch (err) {
      // ignore animation errors
    }
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

  const handleSectionClick = (section) => {
    // Content should remain visible by default. For other sections (colors, logo, custom)
    // clicking the same section again will return view to 'content' (toggle close behavior).
    if (section === 'content') {
      setActiveSection('content');
      return;
    }

    setActiveSection((prev) => (prev === section ? 'content' : section));
  };

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

  const handleGenerate = () => {
    // animation feedback for generation
    triggerPreviewAnimation();
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 -z-10 gradient-bg-custom"></div>

      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur border-b border-slate-100 shadow">
        <div className="max-w-[1400px] mx-auto p-3 md:px-6 md:py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl md:text-2xl font-extrabold text-blue-600">QR Code Generator</h1>
          </div>
          <nav className="flex gap-3 items-center">
            <a href="#" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded">About</a>
            <a href="#" className="text-slate-600 hover:text-blue-600 px-3 py-2 rounded">Pricing</a>
            <a href="#" className="bg-blue-600 text-white px-3 py-2 rounded-lg font-bold shadow">Get Started</a>
          </nav>
        </div>
      </header>

  <main className="max-w-[1200px] mx-auto px-5 pt-6 md:pt-8">
        <section className="text-center my-8 md:my-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Create Beautiful QR Codes</h2>
          <p className="text-slate-500 mt-2 max-w-2xl mx-auto">Design custom QR codes in seconds with our powerful generator</p>
        </section>

        <div className="flex justify-center">
          {/* larger tab group: increased padding and text size for better visibility */}
          <div className="inline-flex flex-wrap gap-2 bg-white p-2 rounded-full border shadow-sm justify-center max-w-md">
            {["url", "text", "email", "phone"].map((tab) => (
              <button
                key={tab}
                onClick={(e) => handleTabClick(tab, e)}
                className={`px-4 py-2 rounded-full font-semibold text-base md:text-lg leading-6 whitespace-nowrap transition-transform will-change-transform ${activeTab === tab ? 'bg-gradient-to-r from-indigo-600 to-blue-500 text-white shadow' : 'text-slate-600 hover:text-blue-600'}`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* content input is rendered inside the left panel's section-content (below) when Content section is active */}

        <div className="content-card grid md:grid-cols-[1fr_420px] grid-cols-1 gap-7 bg-white rounded-2xl p-7 shadow my-8 md:divide-x md:divide-slate-100">
          <div className="left-panel flex flex-col gap-6 md:pr-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Customize Your QR</h3>
              <div className="w-16 h-1 bg-gradient-to-r from-indigo-600 to-blue-400 rounded mt-3"></div>
            </div>

            <div className="flex flex-col gap-3">
              {["content", "colors", "logo", "custom"].map((section) => {
                if (section === 'content') {
                  return (
                    <div key={section} className={`w-full rounded-lg overflow-hidden ${activeSection === 'content' ? 'bg-white border border-blue-100 shadow-sm' : 'bg-slate-50 border border-slate-100'}`}>
                      <button
                        onClick={() => handleSectionClick(section)}
                        className={`w-full text-left p-3 ${activeSection === section ? 'text-blue-600 font-semibold' : 'text-slate-700 font-semibold'}`}
                      >
                        Content
                      </button>

                      {/* input sits inside the same rounded container so button+input look like one unit
                          NOTE: Content should remain visible even when other sections are clicked, so render it always */}
                      <div className="p-4 border-t border-slate-100">
                        <label className="block text-sm font-medium text-slate-700 mb-2">Enter your {activeTab}</label>
                        <input
                          type={getInputType()}
                          className={`w-full p-3 bg-white border ${validationError ? 'border-red-400 bg-red-50' : 'border-slate-200'} rounded-lg text-sm focus:outline-none focus:ring-4 focus:ring-blue-100`}
                          placeholder={getPlaceholder()}
                          value={inputValue}
                          onChange={handleInputChange}
                        />
                        {validationError && (
                          <p className="text-red-500 text-sm mt-2">{validationError}</p>
                        )}
                      </div>
                    </div>
                  );
                }

                if (section === 'colors') {
                  return (
                    <div key={section} className={`w-full rounded-lg overflow-hidden ${activeSection === 'colors' ? 'bg-white border border-blue-100 shadow-sm' : 'bg-slate-50 border border-slate-100'}`}>
                      <button
                        onClick={() => handleSectionClick(section)}
                        className={`w-full text-left p-3 ${activeSection === section ? 'text-blue-600 font-semibold' : 'text-slate-700 font-semibold'}`}
                      >
                        Colors
                      </button>

                      {activeSection === 'colors' && (
                        <div className="p-4 border-t border-slate-100">
                          <div className="flex flex-col gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">QR Code Color</label>
                              <div className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded">
                                <input type="color" value={qrColor} onChange={(e) => setQrColor(e.target.value)} />
                                <span className="font-mono text-sm text-slate-500">{qrColor}</span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-slate-700 mb-2">Background Color</label>
                              <div className="flex items-center gap-3 p-2 bg-white border border-slate-100 rounded">
                                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} />
                                <span className="font-mono text-sm text-slate-500">{bgColor}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                if (section === 'logo') {
                  return (
                    <div key={section} className={`w-full rounded-lg overflow-hidden ${activeSection === 'logo' ? 'bg-white border border-blue-100 shadow-sm' : 'bg-slate-50 border border-slate-100'}`}>
                      <button
                        onClick={() => handleSectionClick(section)}
                        className={`w-full text-left p-3 ${activeSection === section ? 'text-blue-600 font-semibold' : 'text-slate-700 font-semibold'}`}
                      >
                        Logo
                      </button>

                      {activeSection === 'logo' && (
                        <div className="p-4 border-t border-slate-100">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Upload Your Logo</label>
                            <div className="mb-3">
                              <input type="file" id="logo-upload" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                              <label htmlFor="logo-upload" className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-dashed rounded cursor-pointer">Choose Image</label>
                            </div>
                            {logoFile && (
                              <div className="mt-3 text-center">
                                <img src={logoFile} alt="Logo Preview" className="w-24 h-24 object-contain mx-auto rounded" />
                                <p className="text-sm text-slate-500 mt-2">Preview</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                }

                // custom (Design) remains a simple button
                return (
                  <button
                    key={section}
                    onClick={() => handleSectionClick(section)}
                    className={`w-full text-left p-3 rounded-lg ${activeSection === section ? 'bg-blue-50 border border-blue-100 text-blue-600' : 'bg-slate-50 border border-slate-100 text-slate-700'} font-semibold`}
                  >
                    {section === 'custom' ? 'Design' : section}
                  </button>
                );
              })}
            </div>

            <div className="section-content mt-2">

              {/* Content-specific controls will render below (input now sits under the Content button) */}

              {/* color controls moved into the Colors container above */}

              {/* logo upload moved into the Logo container above */}

              {activeSection === "custom" && (
                <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">QR Code Size: <span className="inline-block ml-2 px-2 py-1 bg-blue-50 text-blue-600 rounded">{qrSize}px</span></label>
                    <input type="range" value={qrSize} min="100" max="500" onChange={(e) => setQrSize(parseInt(e.target.value))} className="w-full" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">Corner Radius: <span className="inline-block ml-2 px-2 py-1 bg-blue-50 text-blue-600 rounded">{eyeRadius}px</span></label>
                    <input type="range" value={eyeRadius} min="0" max="50" onChange={(e) => setEyeRadius(parseInt(e.target.value))} className="w-full" />
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-100 rounded">More customization options coming soon!</div>
                </div>
              )}
            </div>

            {/* Action buttons moved to the preview area — left-panel Generate/Download removed for cleaner UI */}
          </div>

          <aside className="right-panel flex flex-col items-center justify-center gap-6 md:pl-6 md:sticky md:top-24" aria-label="QR preview">
            <div className="w-full">
              <div className="flex items-baseline justify-between px-2 mb-3">
                <h4 className="text-sm font-bold">Live Preview</h4>
                <p className="text-sm text-slate-500">Real-time</p>
              </div>
              <div className={`qr-canvas-wrapper p-6 bg-white rounded-xl shadow flex items-center justify-center ${previewRef.current && previewRef.current.classList.contains('preview-animate') ? 'preview-animate' : ''}`} ref={previewRef}>
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
              <div className="mt-4">
                <button onClick={downloadQr} className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-bold">Download QR Code</button>
              </div>
            </div>
          </aside>
        </div>

        <footer className="text-center py-8 text-slate-500">QR Code Generator © 2025</footer>
      </main>
    </div>
  );
};

export default Qrcode;
