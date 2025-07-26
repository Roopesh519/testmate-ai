import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
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
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);

  const chatRef = useRef();
  const mainContainerRef = useRef();
  const messagesContainerRef = useRef();
  const token = localStorage.getItem('token');

  const fetchConversations = async () => {
    try {
      const res = await api.get('/chat/conversations');
      setConversations(res.data.conversations);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const res = await api.get(`/chat/conversations/${conversationId}`);
      setMessages(res.data.messages);
      setActiveConversationId(conversationId);
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  };

  const loadingMessages = [
    'Thinking...',
    'Typing your answer...',
    'Gathering info...',
    'Consulting the data hive...',
    'One sec, almost there...',
  ];

  const handleUpdateConversationTitle = async (conversationId, newTitle) => {
    try {
      await api.patch(`/chat/conversations/${conversationId}`, {
        title: newTitle,
      });

      setConversations((prev) =>
        prev.map((conv) =>
          conv._id === conversationId ? { ...conv, title: newTitle } : conv
        )
      );
    } catch (error) {
      console.error('Error updating conversation title:', error);
      throw error;
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await api.delete(`/chat/conversations/${conversationId}`);

      setConversations((prev) =>
        prev.filter((conv) => conv._id !== conversationId)
      );

      if (activeConversationId === conversationId) {
        setMessages([]);
        setActiveConversationId(null);

        const remainingConversations = conversations.filter(
          (conv) => conv._id !== conversationId
        );
        if (remainingConversations.length > 0) {
          loadConversation(remainingConversations[0]._id);
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      throw error;
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const randomLoadingMessage =
      loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    const newMessage = { prompt: input, response: randomLoadingMessage };

    setMessages((prev) => [...prev, newMessage]);
    setInput('');

    const conversationHistory = messages.flatMap((msg) => [
      { role: 'user', content: msg.prompt },
      { role: 'assistant', content: msg.response },
    ]);

    conversationHistory.push({ role: 'user', content: input });

    try {
      const res = await api.post('/chat', {
        messages: conversationHistory,
        conversationId: activeConversationId,
      });

      const reply = res.data.reply;

      if (!activeConversationId && res.data.conversationId) {
        setActiveConversationId(res.data.conversationId);
        fetchConversations();
      }

      setMessages((prev) => [
        ...prev.slice(0, -1),
        { prompt: input, response: reply },
      ]);
    } catch (err) {
      alert('Error sending message');
      console.error(err);
    }
  };

  // Enhanced viewport height calculation for mobile
  const updateViewportHeight = () => {
    // Use window.visualViewport for better mobile support
    const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
    setViewportHeight(height);
    
    // Set CSS custom property
    const vh = height * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    document.documentElement.style.setProperty('--real-vh', `${height}px`);
  };

  useEffect(() => {
    // Remove any existing page transition overlay
    const overlay = document.getElementById('page-transition-overlay');
    if (overlay) {
      overlay.remove();
    }

    if (!token) {
      alert('You must be logged in to use the chat.');
      window.location.href = '/login';
    }

    // Add chat-specific CSS class to body
    document.body.classList.add('chat-page');

    fetchConversations();

    // Enhanced viewport height handling
    updateViewportHeight();
    
    // Listen for viewport changes (mobile keyboard, etc.)
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', updateViewportHeight);
    }
    
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', () => {
      setTimeout(updateViewportHeight, 100);
    });

    // Trigger page load animation
    setTimeout(() => setIsPageLoaded(true), 100);

    return () => {
      // Clean up chat-specific styles
      document.body.classList.remove('chat-page');
      
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', updateViewportHeight);
      }
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, []);

  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      loadConversation(conversations[0]._id);
    }
  }, [conversations]);

  useEffect(() => {
    // Only prevent body scrolling when sidebars are open, not for main chat
    if (showSidebar || showMobileMenu) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      document.body.style.position = 'fixed';
      document.body.style.width = '100%';
      document.body.style.top = '0';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
      document.body.style.position = '';
      document.body.style.width = '';
      document.body.style.top = '';
    }
  }, [showSidebar, showMobileMenu]);

  useEffect(() => {
    // Smooth scroll to bottom when new messages arrive
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
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
    <div
      ref={mainContainerRef}
      className={`chat-main-container bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex transition-all duration-500 ease-out ${
        isPageLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        height: '100vh',
        maxHeight: '100vh',
        width: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <Sidebar
        conversations={conversations}
        onSelectConversation={loadConversation}
        onNewChat={handleNewChat}
        onUpdateConversationTitle={handleUpdateConversationTitle}
        onDeleteConversation={handleDeleteConversation}
      />
      <MobileSidebar
        conversations={conversations}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        onSelectConversation={loadConversation}
        onNewChat={handleNewChat}
        onUpdateConversationTitle={handleUpdateConversationTitle}
        onDeleteConversation={handleDeleteConversation}
      />
      
      <div className="flex flex-col flex-1 h-full">
        <ChatHeader
          setShowSidebar={setShowSidebar}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          handleLogout={handleLogout}
          isOnChatPage={true}
          className="flex-shrink-0"
        />
        
        <main className="flex-1 p-1 min-h-0">
          <div 
            className={`flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 shadow-xl transition-all duration-700 ease-out h-full ${
              isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            {/* Messages Container - Scrollable */}
            <div 
              ref={messagesContainerRef}
              className="messages-container flex-1 overflow-y-auto overflow-x-hidden"
              style={{
                minHeight: 0,
                scrollBehavior: 'smooth',
                WebkitOverflowScrolling: 'touch'
              }}
            >
              <ChatMessages 
                messages={messages} 
                chatRef={chatRef}
              />
            </div>
            
            {/* Input Container - Fixed at bottom */}
            <div className="flex-shrink-0 border-t border-gray-200">
              <ChatInput
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
                token={token}
                activeConversationId={activeConversationId}
                setMessages={setMessages}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}