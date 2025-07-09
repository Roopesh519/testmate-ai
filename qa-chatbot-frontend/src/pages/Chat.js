import React, { useState, useEffect, useRef } from 'react';
import ChatHeader from '../components/Chat/ChatHeader';
import ChatMessages from '../components/Chat/ChatMessages';
import ChatInput from '../components/Chat/ChatInput';
import Sidebar from '../components/Chat/Sidebar';
import MobileSidebar from '../components/Chat/MobileSidebar';

import { fetchWithRefresh } from '../utils/fetchWithRefresh';
import { getAccessToken, removeAccessToken } from '../utils/auth';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ prevent early redirect flicker

  const chatRef = useRef();

  // ✅ Get token after mount (not at top-level)
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      window.location.href = '/login';
      return;
    }

    fetchConversations().finally(() => setLoading(false)); // Stop loading after fetch
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetchWithRefresh({
        url: `${process.env.REACT_APP_API_BASE_URL}/chat/conversations`,
        method: 'GET'
      });
      setConversations(res.data.conversations);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const res = await fetchWithRefresh({
        url: `${process.env.REACT_APP_API_BASE_URL}/chat/conversations/${conversationId}`,
        method: 'GET'
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
      await fetchWithRefresh({
        url: `${process.env.REACT_APP_API_BASE_URL}/chat/conversations/${conversationId}`,
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        data: { title: newTitle }
      });

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

  const sendMessage = async () => {
    if (!input.trim()) return;

    const randomLoadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    const newMessage = { prompt: input, response: randomLoadingMessage };
    setMessages(prev => [...prev, newMessage]);
    setInput('');

    const conversationHistory = messages.flatMap(msg => ([
      { role: 'user', content: msg.prompt },
      { role: 'assistant', content: msg.response }
    ]));

    conversationHistory.push({ role: 'user', content: input });

    try {
      const res = await fetchWithRefresh({
        url: `${process.env.REACT_APP_API_BASE_URL}/chat`,
        method: 'POST',
        data: {
          messages: conversationHistory,
          conversationId: activeConversationId
        }
      });

      const reply = res.data.reply;

      if (!activeConversationId && res.data.conversationId) {
        setActiveConversationId(res.data.conversationId);
        fetchConversations();
      }

      setMessages(prev => [...prev.slice(0, -1), { prompt: input, response: reply }]);
    } catch (err) {
      alert('Error sending message');
      console.error(err);
    }
  };

  // Load first conversation
  useEffect(() => {
    if (conversations.length > 0 && !activeConversationId) {
      loadConversation(conversations[0]._id);
    }
  }, [conversations]);

  useEffect(() => {
    document.body.style.overflow = (showSidebar || showMobileMenu) ? 'hidden' : '';
  }, [showSidebar, showMobileMenu]);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = () => {
    removeAccessToken();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-lg font-medium">
        Loading chat...
      </div>
    );
  }

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
          isOnChatPage={true}
        />
        <main className="flex-1 p-1 min-h-0 pb-0">
          <div className="flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 shadow-xl min-h-0 h-[calc(100%-0.80rem)]">
            <ChatMessages messages={messages} chatRef={chatRef} />
            <ChatInput
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              activeConversationId={activeConversationId}
              setMessages={setMessages}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
