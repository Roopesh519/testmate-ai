import React, { useEffect, useRef, useState } from 'react';

export default function ChatHeader({
  setShowSidebar,
  showMobileMenu,
  setShowMobileMenu,
  handleLogout,
  isOnChatPage
}) {
  const mobileMenuRef = useRef();
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 👈 Modal state

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
    <>
      <header className="flex justify-between items-center p-4 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 flex-shrink-0 relative z-30 h-16">
        {/* Sidebar toggle for mobile */}
        {isOnChatPage && (
          <button
            className="p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors md:hidden"
            onClick={() => setShowSidebar(true)}
          >
            <img src="layouting.png" alt="Layouting" className="w-6 h-6" />
          </button>
        )}

        {/* Logo */}
        <div className="flex flex-col items-center mt-8 mb-8">
          <a
            href="/"
            onClick={() => setShowMobileMenu(false)}
            className="text-white hover:text-gray-300 transition-colors"
          >
            <img src="testmate-ai.png" alt="Logo" className="w-30 h-8 rounded-lg object-cover" />
          </a>
        </div>

        {/* Menu */}
        <div className="relative z-50">
          {/* Mobile Menu Toggle */}
          <button
            className="p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors md:hidden"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-7">
            <a
              href="/chat"
              onClick={() => setShowMobileMenu(false)}
              className="text-white hover:text-gray-300 transition-colors"
            >
              Chat
            </a>
            <a href="/profile" className="text-white hover:text-gray-300 transition-colors">
              Profile
            </a>
            {['Settings', 'Help'].map((label) => (
              <button
                key={label}
                onClick={() => alert(`${label} clicked`)}
                className="text-white hover:text-gray-300 transition-colors"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => setShowLogoutModal(true)}
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
              <a
                href="/chat"
                onClick={() => setShowMobileMenu(false)}
                className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
              >
                Chat
              </a>
              <a
                href="/profile"
                onClick={() => setShowMobileMenu(false)}
                className="block px-4 py-2 text-white hover:bg-gray-700 transition-colors"
              >
                Profile
              </a>
              {['Settings', 'Help'].map((label) => (
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
                  setShowLogoutModal(true);
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

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md mx-4 border border-gray-600">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Logout</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to logout?</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLogout();
                  setShowLogoutModal(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
