import React, { useState, useEffect } from 'react';
import { FaCookieBite, FaTimes } from 'react-icons/fa';

const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const cookiesAccepted = localStorage.getItem('cookiesAccepted');
    if (!cookiesAccepted) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookiesAccepted', 'true');
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t-2 border-pink-200 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          {/* Cookie Icon */}
          <div className="flex-shrink-0">
            <FaCookieBite className="text-pink-500 text-2xl" />
          </div>
          
          {/* Content */}
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Wir verwenden Cookies
            </h3>
            <p className="text-sm text-gray-600 mb-2">
              Um Ihnen die volle Funktionalität unserer Website zur Verfügung stellen zu können, 
              verwenden wir Cookies. Diese helfen uns dabei, Ihre Präferenzen zu speichern und 
              Ihnen ein besseres Einkaufserlebnis zu bieten.
            </p>
            <p className="text-xs text-gray-500">
              Mehr Informationen finden Sie in unserer{' '}
              <a 
                href="/privacy" 
                className="text-pink-500 hover:text-pink-600 underline"
              >
                Datenschutzerklärung
              </a>
            </p>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 flex-shrink-0">
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <FaTimes size={14} />
              Ablehnen
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2 text-sm font-medium text-white bg-pink-500 hover:bg-pink-600 rounded-lg transition-colors"
            >
              Akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
