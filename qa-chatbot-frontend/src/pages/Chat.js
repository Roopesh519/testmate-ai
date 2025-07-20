import React, { useState, useEffect, useRef } from 'react';
import apiClient from '../utils/api'; // Import our new API client
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const chatRef = useRef();

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');
    return token && refreshToken;
  };

  // Fetch list of all conversations with error handling
  const fetchConversations = async () => {
    try {
      setError(null);
      const res = await apiClient.get('/chat/conversations');
      setConversations(res.data.conversations);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError('Failed to load conversations. Please try again.');
      
      // If it's an auth error, the interceptor will handle it
      if (err.response?.status === 401) {
        console.log('Authentication error - will be handled by interceptor');
      }
    }
  };

  // Load messages of a specific conversation
  const loadConversation = async (conversationId) => {
    try {
      setError(null);
      setIsLoading(true);
      const res = await apiClient.get(`/chat/conversations/${conversationId}`);
      setMessages(res.data.messages);
      setActiveConversationId(conversationId);
    } catch (err) {
      console.error('Failed to load conversation:', err);
      setError('Failed to load conversation. Please try again.');
    } finally {
      setIsLoading(false);
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
      setError(null);
      await apiClient.patch(`/chat/conversations/${conversationId}`, { title: newTitle });

      // Update conversations state
      setConversations(prev =>
        prev.map(conv =>
          conv._id === conversationId
            ? { ...conv, title: newTitle }
            : conv
        )
      );
    } catch (error) {
      console.error('Error updating conversation title:', error);
      setError('Failed to update conversation title.');
      throw error; // Re-throw to let the sidebar handle the error
    }
  };

  // Delete conversation
  const handleDeleteConversation = async (conversationId) => {
    try {
      setError(null);
      await apiClient.delete(`/chat/conversations/${conversationId}`);

      // Remove conversation from state
      setConversations(prev => prev.filter(conv => conv._id !== conversationId));

      // If the deleted conversation was the active one, clear the chat
      if (activeConversationId === conversationId) {
        setMessages([]);
        setActiveConversationId(null);
        
        // Auto-load the first remaining conversation if any exist
        const remainingConversations = conversations.filter(conv => conv._id !== conversationId);
        if (remainingConversations.length > 0) {
          loadConversation(remainingConversations[0]._id);
        }
      }
    } catch (error) {
      console.error('Error deleting conversation:', error);
      setError('Failed to delete conversation.');
      throw error; // Re-throw to let the sidebar handle the error
    }
  };

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) return;

    const randomLoadingMessage = loadingMessages[Math.floor(Math.random() * loadingMessages.length)];
    const newMessage = { prompt: input, response: randomLoadingMessage };

    // Show loading message in UI
    setMessages(prev => [...prev, newMessage]);
    const currentInput = input;
    setInput('');
    setError(null);

    // Build conversation history
    const conversationHistory = messages.flatMap(msg => ([
      { role: 'user', content: msg.prompt },
      { role: 'assistant', content: msg.response }
    ]));

    // Add current user message at the end
    conversationHistory.push({ role: 'user', content: currentInput });

    try {
      const res = await apiClient.post('/chat', {
        messages: conversationHistory,
        conversationId: activeConversationId
      });

      const reply = res.data.reply;

      // Save conversation ID if it's a new one
      if (!activeConversationId && res.data.conversationId) {
        setActiveConversationId(res.data.conversationId);
        fetchConversations(); // Refresh UI
      }

      // Replace loading with actual reply
      setMessages(prev => [...prev.slice(0, -1), { prompt: currentInput, response: reply }]);
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
      
      // Remove the loading message and restore the input
      setMessages(prev => prev.slice(0, -1));
      setInput(currentInput);
    }
  };

  // Initial effect to check auth and fetch conversations
  useEffect(() => {
    if (!isAuthenticated()) {
      console.log('User not authenticated, redirecting to login');
      localStorage.clear();
      window.location.href = '/login';
      return;
    }

    // Initial data fetch
    fetchConversations();

    // Set up viewport height handling
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
  }, [conversations, activeConversationId]);

  // Prevent background scroll when sidebar is open
  useEffect(() => {
    document.body.style.overflow = (showSidebar || showMobileMenu) ? 'hidden' : '';
  }, [showSidebar, showMobileMenu]);

  // Scroll to bottom on new messages
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleLogout = async () => {
    try {
      // Call logout endpoint to clear refresh token from database
      await apiClient.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local logout even if server request fails
    }

    // Clear local storage
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
    setError(null);
  };

  const handleRetry = () => {
    setError(null);
    if (conversations.length === 0) {
      fetchConversations();
    }
  };

  return (
    <div style={{ height: 'calc(var(--vh) * 100)' }} className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white flex">
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
        
        {/* Error Banner */}
        {error && (
          <div className="bg-red-500 bg-opacity-90 text-white p-3 flex justify-between items-center">
            <span>{error} Try logging in again</span>
            <button 
              onClick={handleRetry}
              className="bg-red-700 hover:bg-red-600 px-3 py-1 rounded text-sm"
            >
              Retry
            </button>
          </div>
        )}

        <main className="flex-1 p-1 min-h-0 pb-0">
          <div className="flex flex-col bg-white bg-opacity-90 backdrop-blur-md border border-white border-opacity-20 shadow-xl min-h-0 h-[calc(100%-0.80rem)]">
            {isLoading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-600">Loading conversation...</div>
              </div>
            ) : (
              <ChatMessages messages={messages} chatRef={chatRef} />
            )}
            <ChatInput
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
              activeConversationId={activeConversationId}
              setMessages={setMessages}
              disabled={isLoading || !!error}
            />
          </div>
        </main>
      </div>
    </div>
  );
}