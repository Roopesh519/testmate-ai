import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const chatRef = useRef();

  // Mock token for demo
  const token = localStorage.getItem('token');

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages); // update based on real response structure
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
    }
  };


  useEffect(() => {
    if (!token) {
      alert('You must be logged in to use the chat.');
      window.location.href = '/login';
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, []);

  useEffect(() => {
    if (showSidebar || showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showSidebar, showMobileMenu]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // const sendMessage = async () => {
  // if (!input.trim()) return;
  // const newMessage = { prompt: input, response: 'This is a demo response to your question: ' + input };
  // setMessages(prev => [...prev, newMessage]);
  //  setInput('');
  // };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { prompt: input, response: '...' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chat`, { message: input }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => [
        ...prev.slice(0, -1),
        { prompt: input, response: res.data.reply }
      ]);
    } catch (err) {
      alert('Error sending message');
    }
  };

  // Logout function implementation
  const handleLogout = async () => {
    try {
      // 1. Clear any stored authentication tokens
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      sessionStorage.clear();

      // 2. Call logout API endpoint (if your backend has one)
      // Uncomment when you have real authentication:
      /*
      if (token && token !== 'demo-token') {
        await axios.post(`${process.env.REACT_APP_API_BASE_URL}/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      */

      // 3. Clear application state
      setMessages([]);
      setInput('');
      setShowSidebar(false);
      setShowMobileMenu(false);

      // 4. Show confirmation (optional)
      // alert('Successfully logged out!');

      // 5. Redirect to login page
      // Replace with your actual login route
      // If using React Router: navigate('/login');
      // For now, we'll simulate redirect:
      window.location.href = '/login';

    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed, but clearing session anyway');
      // Still clear session and redirect even if API call fails
      window.location.href = '/login';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  // This sets the CSS variable --vh to the real 1% of the current viewport height
  const setViewportHeight = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  };

  // Set it on load
  setViewportHeight();

  // Update on resize
  window.addEventListener('resize', setViewportHeight);

  return (
    <div style={{ height: 'calc(var(--vh) * 100)' }} className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex">

      {/* Mobile Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-80 bg-gray-900 bg-opacity-95 backdrop-blur-md border-r border-white border-opacity-20">
        <div className="flex flex-col h-full">
          {/* Sidebar Header */}
          <div className="p-4 border-b border-white border-opacity-20">
            <h3 className="text-lg font-bold text-white">Chat History</h3>
          </div>

          {/* Chat History List */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-sm">No chat history yet</p>
            ) : (
              <ul className="space-y-3">
                {messages.map((msg, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors cursor-pointer"
                  >
                    <div className="text-sm text-blue-200 truncate">
                      {msg.prompt}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 truncate">
                      {msg.response.substring(0, 50)}...
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-80 bg-gray-900 bg-opacity-95 backdrop-blur-md border-r border-white border-opacity-20 z-50
        transform transition-transform duration-300 ease-in-out md:hidden
        ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Mobile Sidebar Header */}
          <div className="flex justify-between items-center p-4 border-b border-white border-opacity-20">
            <h3 className="text-lg font-bold text-white">Chat History</h3>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-white text-2xl hover:text-gray-300"
            >
              ×
            </button>
          </div>

          {/* Mobile Chat History List */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-sm">No chat history yet</p>
            ) : (
              <ul className="space-y-3">
                {messages.map((msg, idx) => (
                  <li
                    key={idx}
                    className="p-3 rounded-lg bg-white bg-opacity-10 hover:bg-opacity-20 transition-colors cursor-pointer"
                  >
                    <div className="text-sm text-blue-200 truncate">
                      {msg.prompt}
                    </div>
                    <div className="text-xs text-gray-400 mt-1 truncate">
                      {msg.response.substring(0, 50)}...
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 relative min-h-0">

        {/* Navbar */}
        <header className="flex justify-between items-center p-4 bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20 flex-shrink-0 relative z-30 h-16">
          {/* Left: Sidebar Toggle (Mobile) */}
          <button
            className="p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors md:hidden"
            onClick={() => setShowSidebar(true)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Center: Logo */}
          <div className="flex flex-col items-center mt-8 mb-8">
            <div className="flex items-center gap-4 bg-white bg-opacity-90 border border-white border-opacity-20 rounded-xl p-2 shadow-lg transition-transform hover:-translate-y-1 hover:shadow-2xl">
              <img
                src="ai.png"
                alt="Logo"
                className="w-8 h-8 rounded-lg object-cover"
              />
              <h1 className="text-xl font-bold text-gray-900">TestMate AI</h1>
            </div>
          </div>


          {/* Right: Menu */}
          <div className="relative z-50">
            {/* Mobile Menu Button */}
            <button
              className="p-2 rounded-md hover:bg-white hover:bg-opacity-10 transition-colors md:hidden"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zM12 13a1 1 0 110-2 1 1 0 010 2zM12 20a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>

            {/* Mobile Menu Dropdown */}
            {showMobileMenu && (
              <>
                <div
                  className="fixed inset-0 z-[60]"
                  onClick={() => setShowMobileMenu(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-xl py-2 z-[70] border border-white border-opacity-20">
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      alert('Profile clicked');
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:bg-opacity-50 transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      alert('Settings clicked');
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:bg-opacity-50 transition-colors"
                  >
                    Settings
                  </button>
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      alert('Help clicked');
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 hover:bg-opacity-50 transition-colors"
                  >
                    Help
                  </button>
                  <hr className="my-1 border-gray-300" />
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-black hover:bg-red-50 hover:bg-opacity-50 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                onClick={() => alert('Profile clicked')}
                className="text-white hover:text-gray-300 transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => alert('Settings clicked')}
                className="text-white hover:text-gray-300 transition-colors"
              >
                Settings
              </button>
              <button
                onClick={() => alert('Help clicked')}
                className="text-white hover:text-gray-300 transition-colors"
              >
                Help
              </button>
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  handleLogout();
                }}
                className="block w-full text-left px-4 py-2 text-white hover:bg-red-50 hover:bg-opacity-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Chat Interface */}
        <main className="flex-1 p-4 min-h-0 pb-0">
          <div className="flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-xl min-h-0 h-[calc(100%-0.80rem)]">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    {/* <div className="text-6xl mb-4">🤖</div> */}
                    <h2 className="text-2xl text-black font-bold mb-2">Welcome to QA ChatBot</h2>
                    <p className="text-black text-opacity-70">Ask me anything to get started!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg, idx) => (
                  <div key={idx} className="space-y-3">
                    {/* User Message */}
                    <div className="flex justify-end">
                      <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-blue-600 text-white rounded-lg px-4 py-2 shadow-md">
                        <p className="text-sm">{msg.prompt}</p>
                      </div>
                    </div>

                    {/* Bot Response */}
                    <div className="flex justify-start">
                      <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl bg-black bg-opacity-30 text-white rounded-lg px-4 py-2 shadow-md">
                        <p className="text-sm">{msg.response}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={chatRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-black border-opacity-20 flex-shrink-0 bg-white bg-opacity-5">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask your test-related question..."
                  className="flex-1 px-4 py-3 bg-white bg-opacity-20 text-black placeholder-black placeholder-opacity-50 border border-black border-opacity-30 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-base"
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
