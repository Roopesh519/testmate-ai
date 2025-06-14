import React, { useEffect, useRef } from 'react';

export default function ChatHeader({ setShowSidebar, showMobileMenu, setShowMobileMenu, handleLogout }) {
  const mobileMenuRef = useRef();

  useEffect(() => {
    function handleOutsideClick(event) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setShowMobileMenu(false);
      }
    }

    if (showMobileMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [showMobileMenu, setShowMobileMenu]);

  return (
    <header className="flex justify-between items-center p-4 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 flex-shrink-0 relative z-30 h-16">
      {/* Sidebar toggle for mobile */}
      <button className="p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors md:hidden"
        onClick={() => setShowSidebar(true)}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Logo */}
      <div className="flex flex-col items-center mt-8 mb-8">
        <div className="flex items-center gap-4 bg-white bg-opacity-90 border border-white border-opacity-20 rounded-xl p-2 shadow-lg">
          <img src="ai.png" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
          <h1 className="text-xl font-bold text-gray-900">TestMate AI</h1>
        </div>
      </div>

      {/* Menu */}
      <div className="relative z-50">
        {/* Mobile Menu Toggle */}
        <button className="p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors md:hidden"
          onClick={() => setShowMobileMenu(!showMobileMenu)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
          </svg>
        </button>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {['Profile', 'Settings', 'Help'].map(label => (
            <button key={label} onClick={() => alert(`${label} clicked`)} className="text-white hover:text-gray-300 transition-colors">
              {label}
            </button>
          ))}
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-white hover:bg-red-50 hover:bg-opacity-50 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <div
            ref={mobileMenuRef}
            className="absolute top-14 right-0 bg-gray-800 text-white rounded-lg shadow-lg z-40 w-40 py-2 md:hidden"
          >
            {['Profile', 'Settings', 'Help'].map(label => (
              <button
                key={label}
                onClick={() => {
                  alert(`${label} clicked`);
                  setShowMobileMenu(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => {
                handleLogout();
                setShowMobileMenu(false);
              }}
              className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-900 hover:text-white transition-colors"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
