import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatHeader from '../components/Chat/ChatHeader';
import ChatMessages from '../components/Chat/ChatMessages';
import ChatInput from '../components/Chat/ChatInput';
import Sidebar from '../components/Chat/Sidebar';
import MobileSidebar from '../components/Chat/MobileSidebar';


export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const chatRef = useRef();
  const token = localStorage.getItem('token');

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chat/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages);
    } catch (err) {
      console.error('Failed to fetch chat history:', err);
    }
  };

  useEffect(() => {
    if (!token) {
      alert('You must be logged in to use the chat.');
      window.location.href = '/login';
    }
    fetchHistory();

    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  useEffect(() => {
    if (showSidebar || showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [showSidebar, showMobileMenu]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessage = { prompt: input, response: '...' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chat`, { message: input }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(prev => [...prev.slice(0, -1), { prompt: input, response: res.data.reply }]);
    } catch (err) {
      alert('Error sending message');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setMessages([]);
    setInput('');
    setShowSidebar(false);
    setShowMobileMenu(false);
    window.location.href = '/login';
  };

  return (
    <div style={{ height: 'calc(var(--vh) * 100)' }} className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex">
      {/* Add Sidebar and MobileSidebar later */}
      <Sidebar messages={messages} />
      <MobileSidebar
        messages={messages}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
      />
      <div className="flex flex-col flex-1 relative min-h-0">
        <ChatHeader
          setShowSidebar={setShowSidebar}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          handleLogout={handleLogout}
        />
        <main className="flex-1 p-4 min-h-0 pb-0">
          <div className="flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 rounded-xl shadow-xl min-h-0 h-[calc(100%-0.80rem)]">
            <ChatMessages messages={messages} chatRef={chatRef} />
            <ChatInput
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              handleKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
