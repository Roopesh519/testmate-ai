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

  const loadingMessages = [
    "Thinking...",
    "Typing your answer...",
    "Gathering info...",
    "Consulting the data hive...",
    "One sec, almost there..."
  ];

  const handleUpdateConversationTitle = async (conversationId, newTitle) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/chat/conversations/${conversationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` // if using auth tokens
        },
        body: JSON.stringify({ title: newTitle })
      });

      if (!response.ok) throw new Error('Failed to update title');

      // Update your conversations state
      setConversations(prev =>
        prev.map(conv =>
          conv._id === conversationId
            ? { ...conv, title: newTitle }
            : conv
        )
      );
    } catch (error) {
      console.error('Error updating conversation title:', error);
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const randomLoadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    const newMessage = { prompt: input, response: randomLoadingMessage };

    // Show loading message in UI
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Build conversation history
    const conversationHistory = messages.flatMap(msg => ([
      { role: 'user', content: msg.prompt },
      { role: 'assistant', content: msg.response }
    ]));

    // Add current user message at the end
    conversationHistory.push({ role: 'user', content: input });

    try {
      const res = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/chat`, {
        messages: conversationHistory, // <-- IMPORTANT FIX HERE
        conversationId: activeConversationId
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const reply = res.data.reply;

      // Save conversation ID if it's a new one
      if (!activeConversationId && res.data.conversationId) {
        setActiveConversationId(res.data.conversationId);
        fetchConversations(); // Refresh UI
      }

      // Replace loading with actual reply
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
    <div style={{ height: 'calc(var(--vh) * 100)' }} className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex">
      <Sidebar
        conversations={conversations}
        onSelectConversation={loadConversation}
        onNewChat={handleNewChat}
        onUpdateConversationTitle={handleUpdateConversationTitle}
      />
      <MobileSidebar
        conversations={conversations}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        onSelectConversation={loadConversation}
        onNewChat={handleNewChat}
        onUpdateConversationTitle={handleUpdateConversationTitle}
      />
      <div className="flex flex-col flex-1 relative min-h-0">
        <ChatHeader
          setShowSidebar={setShowSidebar}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          handleLogout={handleLogout}
        />
        <main className="flex-1 p-1 min-h-0 pb-0">
          <div className="flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 shadow-xl min-h-0 h-[calc(100%-0.80rem)]">
            <ChatMessages messages={messages} chatRef={chatRef} />
            <ChatInput
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              token={token} // ✅ Add this
              activeConversationId={activeConversationId} // ✅ Add this
              setMessages={setMessages} // ✅ Add this
            />
          </div>
        </main>
      </div>
    </div>
  );
}
