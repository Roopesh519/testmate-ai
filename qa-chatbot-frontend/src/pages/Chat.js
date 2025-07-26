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

  const chatRef = useRef();
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

    fetchConversations();

    const setViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    setViewportHeight();
    window.addEventListener('resize', setViewportHeight);

    // Trigger page load animation
    setTimeout(() => setIsPageLoaded(true), 100);

    return () => window.removeEventListener('resize', setViewportHeight);
  }, []);

  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      loadConversation(conversations[0]._id);
    }
  }, [conversations]);

  useEffect(() => {
    document.body.style.overflow = showSidebar || showMobileMenu ? 'hidden' : '';
  }, [showSidebar, showMobileMenu]);

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
    <div
      style={{ height: 'calc(var(--vh) * 100)' }}
      className={`bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex transition-all duration-500 ease-out ${
        isPageLoaded ? 'opacity-100' : 'opacity-0'
      }`}
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
      <div className="flex flex-col flex-1 relative min-h-0">
        <ChatHeader
          setShowSidebar={setShowSidebar}
          showMobileMenu={showMobileMenu}
          setShowMobileMenu={setShowMobileMenu}
          handleLogout={handleLogout}
          isOnChatPage={true}
        />
        <main className="flex-1 p-1 min-h-0 pb-0">
          <div className={`flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 shadow-xl min-h-0 h-[calc(100%-0.80rem)] transition-all duration-700 ease-out ${
            isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <ChatMessages messages={messages} chatRef={chatRef} />
            <ChatInput
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              token={token}
              activeConversationId={activeConversationId}
              setMessages={setMessages}
            />
          </div>
        </main>
      </div>
    </div>
  );
}