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
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);

  const chatRef = useRef();
  const token = localStorage.getItem('token');

  // Fetch list of all conversations
  const fetchConversations = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chat/conversations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setConversations(res.data.conversations);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  // Load messages of a specific conversation
  const loadConversation = async (conversationId) => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/chat/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.messages);
      setActiveConversationId(conversationId);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = { prompt: input, response: '...' };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chat`, {
        message: input,
        conversationId: activeConversationId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const reply = res.data.reply;

      // If a new conversation was created, store its ID
      if (!activeConversationId && res.data.conversationId) {
        setActiveConversationId(res.data.conversationId);
        fetchConversations(); // Refresh sidebar
      }

      setMessages(prev => [...prev.slice(0, -1), { prompt: input, response: reply }]);
    } catch (err) {
      alert('Error sending message');
      console.error(err);
    }
  };

  // Initial effect to check auth and fetch conversations
  useEffect(() => {
    if (!token) {
      alert('You must be logged in to use the chat.');
      window.location.href = '/login';
    }

    fetchConversations();

    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);
    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  // Auto-load first conversation if none is selected
  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      loadConversation(conversations[0]._id);
    }
  }, [conversations]);

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = (showSidebar || showMobileMenu) ? 'hidden' : '';
  }, [showSidebar, showMobileMenu]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    setMessages([]);
    setInput('');
    setShowSidebar(false);
    setShowMobileMenu(false);
    window.location.href = '/login';
  };

  const handleNewChat = () => {
    setMessages([]);
    setActiveConversationId(null);
    setInput('');
  };

  return (
    <div style={{ height: 'calc(var(--vh) * 100)' }} className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex">
      <Sidebar
        conversations={conversations}
        onSelectConversation={loadConversation}
        onNewChat={handleNewChat}
      />
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
